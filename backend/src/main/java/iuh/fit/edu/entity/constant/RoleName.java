package iuh.fit.edu.entity.constant;

public enum RoleName {
    ADMIN {
        @Override
        public String toString() {
            return "Admin";
        }
    }, STAFF {
        @Override
        public String toString() {
            return "Nhân viên";
        }
    }, CUSTOMER {
        @Override
        public String toString() {
            return "Khách hàng";
        }
    }, WARE_HOUSE_STAFF {
        @Override
        public String toString(){
            return "Thủ kho";
        }
    }
}
