package iuh.fit.edu.entity.constant;

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
