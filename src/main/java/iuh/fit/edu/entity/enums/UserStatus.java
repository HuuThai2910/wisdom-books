package iuh.fit.edu.entity.enums;

public enum UserStatus {
    ACTIVE {
        @Override
        public String toString() {
            return "Active";
        }
    }, INACTIVE {
        @Override
        public String toString() {
            return "Inactive";
        }
    };
}

