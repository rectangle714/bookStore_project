package com.bootProject.web.item.repository.file;

import com.bootProject.web.item.entity.SaveFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<SaveFile, Long>, FileRepositoryCustom {



}
