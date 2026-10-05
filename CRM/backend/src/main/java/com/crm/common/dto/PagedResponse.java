package com.crm.common.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.ZonedDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class PagedResponse<T> extends ApiResponse<List<T>> {
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;

    public PagedResponse(boolean success, String message, List<T> data, ZonedDateTime timestamp, int pageNumber, int pageSize, long totalElements, int totalPages, boolean last) {
        super(success, message, data, timestamp);
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.last = last;
    }
}
