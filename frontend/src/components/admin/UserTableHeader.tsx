interface UserTableHeaderProps {
  onAddUser: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const UserTableHeader = ({ onAddUser, searchValue, onSearchChange }: UserTableHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <h1 className="text-2xl font-semibold text-gray-900">Quản lý người dùng</h1>
      
      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-[300px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm 
              outline-none transition-all duration-300 focus:border-[#8B86C7] focus:ring-4 
              focus:ring-[#8B86C7]/10"
          />
        </div>
        
        <button className="px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm 
          font-medium transition-all duration-200 hover:bg-gray-50 flex items-center gap-2">
          <span>🔽</span>
          Lọc
        </button>
        
        <button className="px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm 
          font-medium transition-all duration-200 hover:bg-gray-50 flex items-center gap-2">
          <span>⬍⬍</span>
          Sắp xếp
        </button>
        
        <button
          onClick={onAddUser}
          className="px-5 py-2.5 text-white rounded-lg text-sm font-semibold 
            transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2
            shadow-lg hover:shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #A8A4D8 0%, #8B86C7 50%, #6B66A3 100%)'
          }}
        >
          <span>+</span>
          Thêm người dùng
        </button>
      </div>
    </div>
  );
};

export default UserTableHeader;
