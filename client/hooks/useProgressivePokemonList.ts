'use client';

import { useQuery } from '@apollo/client';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLoading, setError, setPokemons, addPokemons } from '@/store/slices/pokemonSlice';
import { GET_POKEMONS } from '@/graphql/queries';
import { useEffect, useState } from 'react';

interface UseProgressivePokemonListOptions {
  initialLimit?: number;  // 初回読み込み数
  expandLimit?: number;   // 自動拡張時の読み込み数
  autoExpand?: boolean;   // 自動拡張有効
}

export function useProgressivePokemonList({ 
  initialLimit = 12,      // 最初は12匹だけ（超高速）
  expandLimit = 20,       // その後は20匹ずつ
  autoExpand = true 
}: UseProgressivePokemonListOptions = {}) {
  const dispatch = useAppDispatch();
  const { pokemons, loading, error } = useAppSelector((state) => state.pokemon);
  const [phase, setPhase] = useState<'initial' | 'expanding' | 'complete'>('initial');
  
  // Phase 1: 初回超高速読み込み（12匹）
  const { data: initialData, loading: initialLoading, error: initialError } = useQuery(
    GET_POKEMONS,
    {
      variables: { limit: initialLimit, offset: 0 },
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all',
    }
  );

  // Phase 2: 自動拡張読み込み（追加20匹）
  const { data: expandData, loading: expandLoading, refetch: expandFetch } = useQuery(
    GET_POKEMONS,
    {
      variables: { limit: expandLimit, offset: initialLimit },
      skip: phase === 'initial', // 最初はスキップ
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all',
    }
  );

  // Phase 1完了時の処理
  useEffect(() => {
    if (initialData?.pokemons && phase === 'initial') {
      const { edges } = initialData.pokemons;
      const pokemonList = edges.map((edge: any) => edge.node);
      
      dispatch(setPokemons(pokemonList));
      dispatch(setLoading(false));
      
      console.log(`Phase 1: Loaded ${pokemonList.length} Pokemon ultra-fast`);
      
      // 自動拡張開始（少し遅延を入れる）
      if (autoExpand) {
        setTimeout(() => {
          setPhase('expanding');
        }, 500); // 500ms後に自動拡張開始
      }
    }
  }, [initialData, phase, dispatch, autoExpand]);

  // Phase 2完了時の処理
  useEffect(() => {
    if (expandData?.pokemons && phase === 'expanding') {
      const { edges } = expandData.pokemons;
      const newPokemon = edges.map((edge: any) => edge.node);
      
      dispatch(addPokemons(newPokemon));
      setPhase('complete');
      
      console.log(`Phase 2: Added ${newPokemon.length} more Pokemon`);
    }
  }, [expandData, phase, dispatch]);

  // Loading状態管理
  useEffect(() => {
    const isLoading = phase === 'initial' ? initialLoading : expandLoading;
    dispatch(setLoading(isLoading));
  }, [initialLoading, expandLoading, phase, dispatch]);

  // Error状態管理
  useEffect(() => {
    const error = initialError || initialError;
    if (error) {
      dispatch(setError(error.message));
    } else {
      dispatch(setError(null));
    }
  }, [initialError, initialError, dispatch]);

  return {
    pokemons,
    loading: phase === 'initial' ? initialLoading : expandLoading,
    error,
    phase,
    isInitialLoadComplete: phase !== 'initial',
    totalLoaded: pokemons.length,
    expandMore: () => {
      if (phase === 'initial') {
        setPhase('expanding');
      }
    }
  };
}