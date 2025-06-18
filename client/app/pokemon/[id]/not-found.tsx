import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">❓</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Pokemon Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          The Pokemon you are looking for could not be found.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Pokedex
        </Link>
      </div>
    </div>
  );
}