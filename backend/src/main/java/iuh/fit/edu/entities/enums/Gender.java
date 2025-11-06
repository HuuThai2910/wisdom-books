package iuh.fit.edu.entities.enums;

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
