package iuh.fit.edu.controller.user;

import iuh.fit.edu.dto.request.user.CreateUserRequest;
import iuh.fit.edu.dto.request.user.UpdateUserRequest;
import iuh.fit.edu.dto.response.user.UserResponseById;
import iuh.fit.edu.dto.response.user.UsersResponse;
import iuh.fit.edu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping("/users")
    public ResponseEntity<UsersResponse> getAllUser(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status
    ){
        return ResponseEntity.ok(userService.findAll(keyword, sortBy, sortDirection, role, status));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseById> updateUser(@PathVariable Long id){
        return ResponseEntity.ok(userService.findUserById(id));
    }

    @PostMapping(value = "/users")
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

    @GetMapping("/users/avatar/{filename}")
    public ResponseEntity<iuh.fit.edu.dto.response.ApiResponse<String>> getAvatarUrl(@PathVariable String filename){
        String url = userService.getAvatarUrl(filename);
        return ResponseEntity.ok(iuh.fit.edu.dto.response.ApiResponse.success(200, "Avatar URL retrieved", url));
    }

    @PostMapping(value = "/users/avatar/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<iuh.fit.edu.dto.response.ApiResponse<String>> uploadAvatar(@RequestParam("avatar") MultipartFile avatar){
        String filename = userService.uploadAvatar(avatar);
        return ResponseEntity.ok(iuh.fit.edu.dto.response.ApiResponse.success(200, "Avatar uploaded successfully", filename));
    }
}
