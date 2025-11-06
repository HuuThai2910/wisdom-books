package iuh.fit.edu.entity.constant;

public enum UserStatus {
    ACTIVE {
        @Override
        public String toString() {
            return "Hoạt động";
        }
    }, INACTIVE {
        @Override
        public String toString() {
            return "Ngừng hoạt động";
        }
    };
}

