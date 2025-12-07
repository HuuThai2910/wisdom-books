export default function AdminFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <div>2025, made with by Wisdom Book Team</div>
        <div className="mt-2 sm:mt-0">
          <a href="#" className="hover:text-blue-600 mx-2">
            Help
          </a>
          <a href="#" className="hover:text-blue-600 mx-2">
            Licenses
          </a>
        </div>
      </div>
    </footer>
  );
}
