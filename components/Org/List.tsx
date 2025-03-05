// ./components/Org/List.tsx
"use client";

import { auth } from "@/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import OrgCard from "@/components/Org/Card";
import { FirestoreOrg } from "@/types";
import VaulDrawer from "@/components/Drawer";
import Loader from "@/components/Loader";
import CreateOrgForm from "@/components/Org/Form";
import getUserOrgsRealtime from "@/utils/firebase/org/getUserOrgs";

const OrgList = () => {
  const [user] = useAuthState(auth);
  const [orgs, setOrgs] = useState<Array<FirestoreOrg & { id: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);

    // Use our new utility function
    const unsubscribe = getUserOrgsRealtime(user.uid, (organizations) => {
      setOrgs(organizations);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return user?.uid ? (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader loading={loading} className="h-8 w-8" />
        </div>
      ) : orgs.length > 0 ? (
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orgs.map((org) => (
              <li key={org.id} className="flex-1">
                <OrgCard org={org} />
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-center h-full py-6">
            <VaulDrawer
              title="Create Organization"
              trigger={
                <button className="btn primary">Create Organization</button>
              }
              open={open}
              onOpenChange={setOpen}
            >
              <CreateOrgForm onClose={() => setOpen(false)} />
            </VaulDrawer>
          </div>
        </>
      ) : (
        <div className="flex items-center flex-col gap-1 justify-center h-full">
          <p>No organizations found</p>
          <VaulDrawer
            title="Create Organization"
            trigger={
              <button className="btn primary">Create Organization</button>
            }
            open={open}
            onOpenChange={setOpen}
          >
            <CreateOrgForm onClose={() => setOpen(false)} />
          </VaulDrawer>
        </div>
      )}
    </div>
  ) : (
    <p className="text-center">Please sign in to view your organizations</p>
  );
};

export default OrgList;
