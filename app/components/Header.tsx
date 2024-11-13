
export default function Header() {
    return (
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-2xl font-bold">Liquidity Pool Dashboard</h1>
          <nav>
            <a className="px-4 hover:text-blue-200">Home</a>
          </nav>
        </div>
      </header>
    );
  }