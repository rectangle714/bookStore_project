package com.bs_web.web.item.repository.file;

import com.bs_web.web.item.entity.SaveFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<SaveFile, Long>, FileRepositoryCustom {



}
