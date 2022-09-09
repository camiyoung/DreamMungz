package dreammungz.db.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/*
@author 황승주
@since 2022. 09. 07.
*/

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicUpdate
@Entity
@Getter
@Table(name = "job")
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private List<Achievement> achievements= new ArrayList<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private List<Condition> conditions = new ArrayList<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private List<Nft> nfts = new ArrayList<>();

    @Builder
    public Job(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
