package com.dentalclinic.repository;

import com.dentalclinic.model.PaymentWebhookEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentWebhookEventRepository extends JpaRepository<PaymentWebhookEvent, String> {

    Optional<PaymentWebhookEvent> findByEventId(String eventId);

    boolean existsByEventId(String eventId);
}
