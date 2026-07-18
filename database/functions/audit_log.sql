CREATE OR REPLACE FUNCTION audit_log(
  p_actor_id text,
  p_actor_type text,
  p_action text,
  p_entity_type text,
  p_entity_id text,
  p_changes jsonb DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_branch_id uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO audit_logs (
    actor_id, actor_type, action, entity_type, entity_id,
    changes, ip_address, user_agent, branch_id
  ) VALUES (
    p_actor_id, p_actor_type, p_action, p_entity_type, p_entity_id,
    p_changes, p_ip_address, p_user_agent, p_branch_id
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;
