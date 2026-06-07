export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
