package iuh.fit.edu.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller để test authentication và roles
 */
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/roles")
    public Map<String, Object> testRoles(Authentication authentication) {
        Map<String, Object> result = new HashMap<>();
        
        // In ra console
        System.out.println("=== Testing Authentication ===");
        System.out.println("Name: " + authentication.getName());
        System.out.println("Principal: " + authentication.getPrincipal());
        System.out.println("Authorities:");
        authentication.getAuthorities()
                .forEach(a -> System.out.println("  - " + a.getAuthority()));
        
        // Trả về JSON
        result.put("name", authentication.getName());
        result.put("principal", authentication.getPrincipal().toString());
        result.put("authorities", authentication.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toList()));
        
        return result;
    }
    
    @GetMapping("/admin-only")
    public String testAdminOnly() {
        return "✅ Bạn có quyền ADMIN!";
    }
    
    @GetMapping("/staff-only")
    public String testStaffOnly() {
        return "✅ Bạn có quyền STAFF!";
    }
    
    @GetMapping("/customer-only")
    public String testCustomerOnly() {
        return "✅ Bạn có quyền CUSTOMER!";
    }
    
    @GetMapping("/warehouse-only")
    public String testWarehouseOnly() {
        return "✅ Bạn có quyền WARE_HOUSE_STAFF!";
    }
}
