package com.teamthree.legalaid.specification;

import com.teamthree.legalaid.entity.LawyerProfile;
import com.teamthree.legalaid.entity.NgoProfile;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class DirectorySpecification {

    // Lawyer specification: filter + optional keyword search across name, expertise, location
    public static Specification<LawyerProfile> lawyerSpec(
            String keyword, String expertise, String location, Boolean verified) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (expertise != null && !expertise.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("expertise")),
                        "%" + expertise.toLowerCase() + "%"));
            }
            if (location != null && !location.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")),
                        "%" + location.toLowerCase() + "%"));
            }
            if (verified != null) {
                predicates.add(cb.equal(root.get("verified"), verified));
            }
            if (keyword != null && !keyword.isBlank()) {
                String kw = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.join("user").get("fullname")), kw),
                    cb.like(cb.lower(root.get("expertise")), kw),
                    cb.like(cb.lower(root.get("location")), kw),
                    cb.like(cb.lower(root.get("specialization")), kw)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    // NGO specification: filter + optional keyword search across org name, expertise, location
    public static Specification<NgoProfile> ngoSpec(
            String keyword, String expertise, String location, Boolean verified) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (expertise != null && !expertise.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("expertise")),
                        "%" + expertise.toLowerCase() + "%"));
            }
            if (location != null && !location.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")),
                        "%" + location.toLowerCase() + "%"));
            }
            if (verified != null) {
                predicates.add(cb.equal(root.get("verified"), verified));
            }
            if (keyword != null && !keyword.isBlank()) {
                String kw = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("organizationName")), kw),
                    cb.like(cb.lower(root.join("user").get("fullname")), kw),
                    cb.like(cb.lower(root.get("expertise")), kw),
                    cb.like(cb.lower(root.get("location")), kw)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}