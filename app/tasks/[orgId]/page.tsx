"use client";

import TaskList from "@/components/Task/List";
import { use, useState, useEffect } from "react";
import VaulDrawer from "@/components/Drawer";
import TaskForm from "@/components/Task/Form";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FirestoreOrg } from "@/types";
import Loader from "@/components/Loader";
import { DocumentData } from "firebase/firestore";
import { getOrgRealtime } from "@/utils/firebase/org/getUserOrgs";

const OrgPage = ({ params }: { params: Promise<{ orgId: string }> }) => {
  const [open, setOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [org, setOrg] = useState<
    (FirestoreOrg & { id: string; members: DocumentData[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const orgId = use(params).orgId;

  useEffect(() => {
    if (!orgId || !user) return;

    setLoading(true);

    // Use our new utility function for real-time org data
    const unsubscribe = getOrgRealtime(orgId, (organization) => {
      setOrg(organization);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orgId, user]);

  useEffect(() => {
    const handleCheck = async () => {
      if (!orgId || !user) return;
      const check = await (
        await fetch("/api/permit/check", {
          method: "POST",
          body: JSON.stringify({
            user: user.uid,
            action: "read",
            resource: `Organization:${orgId}`,
          }),
        })
      ).json();
      setHasAccess(check);
    };

    handleCheck();
  }, [orgId, user]);

  return (
    <section className="site-section">
      <div className="wrapper">
        {!hasAccess && !loading ? (
          <div className="flex items-center gap-2">
            <span className="text-red-500">
              You do not have access to this organization
            </span>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between items-start sm:items-center">
              {/* Display org data */}
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader loading={loading} className="h-5 w-5" />
                  <span>Loading organization data...</span>
                </div>
              ) : org ? (
                <div>
                  <h1 className="text-2xl font-semibold">{org.name}</h1>

                  <div className="text-sm text-gray-500 mt-1">
                    {org.members.length} member
                    {org.members.length !== 1 ? "s" : ""}
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-medium">
                    Organization not found
                  </h1>
                </div>
              )}

              <VaulDrawer
                open={open}
                onOpenChange={setOpen}
                title="Create Task"
                trigger={<button className="btn primary">Create Task</button>}
              >
                <TaskForm
                  mode="create"
                  userOrgId={orgId}
                  onClose={() => {
                    setOpen(false);
                  }}
                />
              </VaulDrawer>
            </div>

            {!loading && org && <TaskList userOrgId={orgId} />}
          </>
        )}
      </div>
    </section>
  );
};

export default OrgPage;
