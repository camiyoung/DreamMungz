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
@Table(name = "status")
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "status_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "status", cascade = CascadeType.ALL)
    private List<Condition> conditions = new ArrayList<>();

    @OneToMany(mappedBy = "status", cascade = CascadeType.ALL)
    private List<GameStatus> gameStatuses = new ArrayList<>();

    @OneToMany(mappedBy = "status", cascade = CascadeType.ALL)
    private List<NftStatus> nftStatuses = new ArrayList<>();

    @OneToMany(mappedBy = "status", cascade = CascadeType.ALL)
    private List<Selection> selections = new ArrayList<>();

    @Builder
    public Status(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
