import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useAvatarCheck = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAvatar = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      setAvatarUrl(data?.avatar_url || null);
      setLoading(false);
    };

    fetchAvatar();
  }, [user?.id]);

  const updateAvatar = async (url: string) => {
    if (!user?.id) return;

    await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('id', user.id);

    setAvatarUrl(url);
  };

  return { avatarUrl, loading, updateAvatar };
};
