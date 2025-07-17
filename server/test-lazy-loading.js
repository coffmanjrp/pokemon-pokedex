// Test script to verify lazy loading of form species data
const axios = require('axios');

async function testLazyLoading() {
  const serverUrl = 'http://localhost:4000/graphql';
  
  console.log('Testing lazy loading of Pokemon forms...');
  
  // Test query for Generation 0 Pokemon (forms)
  const query = `
    query GetPokemonsBasic($limit: Int!, $offset: Int!) {
      pokemonsBasic(limit: $limit, offset: $offset) {
        edges {
          node {
            id
            name
            species {
              id
              name
            }
          }
        }
        pageInfo {
          hasNextPage
        }
        totalCount
      }
    }
  `;
  
  try {
    const startTime = Date.now();
    
    // Request first page of Generation 0 (forms start at offset 10032)
    const response = await axios.post(serverUrl, {
      query,
      variables: {
        limit: 20,
        offset: 10032
      }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`Request completed in ${duration}ms`);
    console.log(`Fetched ${response.data.data.pokemonsBasic.edges.length} Pokemon forms`);
    console.log('First 3 forms:');
    response.data.data.pokemonsBasic.edges.slice(0, 3).forEach(edge => {
      console.log(`  - ${edge.node.name} (ID: ${edge.node.id}, Species: ${edge.node.species.name})`);
    });
    
    if (duration < 10000) {
      console.log('\n✅ Success! Lazy loading is working - request completed quickly');
    } else {
      console.log('\n⚠️  Warning: Request took longer than expected');
    }
  } catch (error) {
    console.error('Error testing lazy loading:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testLazyLoading();