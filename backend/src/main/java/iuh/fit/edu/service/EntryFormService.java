package iuh.fit.edu.service;

import iuh.fit.edu.dto.request.entryform.CreateEntryFormDTO;
import iuh.fit.edu.dto.response.ResultPaginationDTO;
import iuh.fit.edu.dto.response.entryform.ResEntryFormDTO;
import iuh.fit.edu.dto.response.entryform.ResEntryFormDetailDTO;
import iuh.fit.edu.entity.EntryForm;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

/**
 * @author Nguyen Tan Nghi & The Bao
 * @version 1.0
 */
public interface EntryFormService {
    ResultPaginationDTO getAllEntryForms(Specification<EntryForm> spec, Pageable pageable);
    ResEntryFormDTO convertToResEntryFormDTO(EntryForm entryForm);
    Long getNextInvoiceNumber();
    Integer getTotalInventoryQuantity();
    ResEntryFormDTO createEntryForm(CreateEntryFormDTO dto);
    List<ResEntryFormDetailDTO> getEntryFormDetails(Long entryFormId);
}
