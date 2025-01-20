'use client';
import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types/profile';

type ProfileContextType = {
  profile: Profile | null;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
  loading: boolean;
};

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: () => {},
  loading: true,
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription?.unsubscribe();
  }, [supabase, router]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}