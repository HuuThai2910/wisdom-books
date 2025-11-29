package iuh.fit.edu.controller.user;

import iuh.fit.edu.dto.request.user.CreateUserRequest;
import iuh.fit.edu.dto.request.user.UpdateUserRequest;
import iuh.fit.edu.dto.response.user.UserResponseById;
import iuh.fit.edu.dto.response.user.UsersResponse;
import iuh.fit.edu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping("/users")
    public ResponseEntity<UsersResponse> getAllUser(){
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseById> updateUser(@PathVariable Long id){
        return ResponseEntity.ok(userService.findUserById(id));
    }

    @PostMapping("/users")
    public ResponseEntity<String> createUser(@RequestBody CreateUserRequest request){
            if(userService.createUser(request)){
                return ResponseEntity.ok("created successs");
            }
            return ResponseEntity.badRequest().body("Error create");
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id,@RequestBody UpdateUserRequest request){
        userService.updateUser(id,request);
        return ResponseEntity.ok("Updated success");
    }

    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.ok("Deleted success");
    }
}
