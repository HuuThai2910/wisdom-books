package iuh.fit.edu.controller;

import com.turkraft.springfilter.boot.Filter;
import iuh.fit.edu.dto.request.entryform.CreateEntryFormDTO;
import iuh.fit.edu.dto.response.ResultPaginationDTO;
import iuh.fit.edu.dto.response.account.UserInfoResponse;
import iuh.fit.edu.dto.response.entryform.ResEntryFormDTO;
import iuh.fit.edu.dto.response.entryform.ResEntryFormDetailDTO;
import iuh.fit.edu.entity.EntryForm;
import iuh.fit.edu.service.EntryFormService;
import iuh.fit.edu.util.GetTokenRequest;
import iuh.fit.edu.util.anotation.ApiMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author The Bao
 * @version 1.0
 */
@RestController
@RequestMapping("/api/entry-forms")
@RequiredArgsConstructor
public class EntryFormController {
    private final EntryFormService entryFormService;

    @GetMapping
    @ApiMessage("Lấy danh sách phiếu nhập kho")
    public ResponseEntity<ResultPaginationDTO> getAllEntryForms(
            @Filter Specification<EntryForm> spec,
            Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(this.entryFormService.getAllEntryForms(spec, pageable));
    }

    @GetMapping("/next-invoice-number")
    @ApiMessage("Lấy số hóa đơn tiếp theo")
    public ResponseEntity<Long> getNextInvoiceNumber() {
        return ResponseEntity.ok(this.entryFormService.getNextInvoiceNumber());
    }

    @GetMapping("/total-inventory")
    @ApiMessage("Lấy tổng số lượng sách trong kho")
    public ResponseEntity<Integer> getTotalInventoryQuantity() {
        return ResponseEntity.ok(this.entryFormService.getTotalInventoryQuantity());
    }

    @PostMapping
    @ApiMessage("Tạo phiếu nhập kho")
    public ResponseEntity<ResEntryFormDTO> createEntryForm(@Valid @RequestBody CreateEntryFormDTO dto, HttpServletRequest request) {
        UserInfoResponse user = GetTokenRequest.getInfoUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.entryFormService.createEntryForm(dto, user.getEmail()));
    }

    @GetMapping("/{id}/details")
    @ApiMessage("Lấy chi tiết phiếu nhập kho")
    public ResponseEntity<List<ResEntryFormDetailDTO>> getEntryFormDetails(@PathVariable Long id) {
        return ResponseEntity.ok(this.entryFormService.getEntryFormDetails(id));
    }
}
