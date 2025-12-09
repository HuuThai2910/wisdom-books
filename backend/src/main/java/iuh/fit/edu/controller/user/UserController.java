package iuh.fit.edu.controller.user;

import iuh.fit.edu.config.SecurityConfig;
import iuh.fit.edu.controller.account.AccountController;
import iuh.fit.edu.dto.request.user.CreateUserRequest;
import iuh.fit.edu.dto.request.user.UpdateUserRequest;
import iuh.fit.edu.dto.response.ApiResponse;
import iuh.fit.edu.dto.response.account.UserInfoResponse;
import iuh.fit.edu.dto.response.user.UserResponseById;
import iuh.fit.edu.dto.response.user.UsersResponse;
import iuh.fit.edu.service.AccountService;
import iuh.fit.edu.service.UserService;
import iuh.fit.edu.util.GetTokenRequest;
import iuh.fit.edu.util.anotation.ApiMessage;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    UserService userService;
    @GetMapping("/users")
    @ApiMessage("Lấy danh sách người dùng thành công")
    public ResponseEntity<UsersResponse> getAllUser(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDirection,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            HttpServletRequest request
    ){

        UserInfoResponse response= GetTokenRequest.getInfoUser(request);
        System.out.println(response.getEmail());
        return ResponseEntity.ok(userService.findAll(keyword, sortBy, sortDirection, role, status));
    }

    @GetMapping("/users/{id}")
    @ApiMessage("Lấy thông tin người dùng theo ID thành công")
    public ResponseEntity<UserResponseById> updateUser(@PathVariable Long id){
        return ResponseEntity.ok(userService.findUserById(id));
    }

    @PostMapping(value = "/users")
    @ApiMessage("Tạo người dùng mới thành công")
    public ResponseEntity<String> createUser(@RequestBody CreateUserRequest createUserRequest,HttpServletRequest request){
        UserInfoResponse response= GetTokenRequest.getInfoUser(request);

        if(userService.createUser(createUserRequest, response.getEmail())){
                return ResponseEntity.ok("created successs");
            }
            return ResponseEntity.badRequest().body("Error create");
    }

    @PutMapping("/users/{id}")
    @ApiMessage("Cập nhật thông tin người dùng thành công")
    public ResponseEntity<String> updateUser(@PathVariable Long id,@RequestBody UpdateUserRequest updateUserRequest,HttpServletRequest request){
        UserInfoResponse response= GetTokenRequest.getInfoUser(request);
        userService.updateUser(id,updateUserRequest,response.getEmail());
        return ResponseEntity.ok("Updated success");
    }

    @DeleteMapping("/users/delete/{id}")
    @ApiMessage("Xóa người dùng thành công")
    public ResponseEntity<String> deleteUser(@PathVariable Long id,HttpServletRequest request){
        UserInfoResponse response= GetTokenRequest.getInfoUser(request);
        userService.deleteUser(id,response.getEmail());
        return ResponseEntity.ok("Deleted success");
    }

    @GetMapping("/users/avatar/{filename}")
    @ApiMessage("Lấy URL avatar thành công")
    public ResponseEntity<ApiResponse<String>> getAvatarUrl(@PathVariable String filename){
        String url = userService.getAvatarUrl(filename);
        return ResponseEntity.ok(ApiResponse.success(200, "Avatar URL retrieved", url));
    }

    @PostMapping(value = "/users/avatar/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiMessage("Tải lên avatar thành công")
    public ResponseEntity<ApiResponse<String>> uploadAvatar(@RequestParam("avatar") MultipartFile avatar){
        String filename = userService.uploadAvatar(avatar);
        return ResponseEntity.ok(ApiResponse.success(200, "Avatar uploaded successfully", filename));
    }
}
