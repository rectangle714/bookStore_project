package core.item.repository.file;

import core.item.entity.SaveFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<SaveFile, Long>, FileRepositoryCustom {



}
