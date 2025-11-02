package iuh.fit.edu.entity.enums;

public enum RoleName {
    ADMIN {
        @Override
        public String toString() {
            return "Admin";
        }
    }, STAFF {
        @Override
        public String toString() {
            return "Staff";
        }
    }, CUSTOMER {
        @Override
        public String toString() {
            return "Customer";
        }
    }
}
