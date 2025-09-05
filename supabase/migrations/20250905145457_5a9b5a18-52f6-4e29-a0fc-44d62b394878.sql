-- Create a function to get the current period from payments.periodo
CREATE OR REPLACE FUNCTION public.get_current_period()
RETURNS TABLE(
  id bigint,
  start date,
  "end" date
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.start,
    p."end"
  FROM payments.periodo p
  ORDER BY p.start DESC
  LIMIT 1;
END;
$$;