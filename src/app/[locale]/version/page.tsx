export default function VersionPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="rounded-2xl bg-white p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">App Version</h1>
        <p className="text-xl text-blue-600 font-mono bg-blue-50 py-2 px-4 rounded-lg">
          v1.0.1
        </p>
        <p className="text-gray-500 mt-4 text-sm">
          قم بتغيير هذا الرقم مع كل عملية رفع (Deploy) <br/>
          للتأكد من أن التعديلات انعكست بنجاح.
        </p>
      </div>
    </div>
  );
}
