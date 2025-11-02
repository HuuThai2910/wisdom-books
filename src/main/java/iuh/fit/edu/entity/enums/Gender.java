package iuh.fit.edu.entity.enums;

public enum Gender {
    MALE {
        @Override
        public String toString() {
            return "Nam";
        }
    }, FEMALE {
        @Override
        public String toString() {
            return "Nữ";
        }
    };

}
