CREATE OR REPLACE FUNCTION public.get_current_period()
RETURNS TABLE(id bigint, start date, "end" date)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.start,
    p."end"
  FROM payments.periodo p
  ORDER BY p.created_at DESC
  LIMIT 1;
END;
$function$