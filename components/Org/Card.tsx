"use client";

import React from "react";
import Link from "next/link";
import { FirestoreOrg } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Building01Icon } from "@hugeicons/core-free-icons";
import VaulDrawer from "@/components/Drawer";

import { useState } from "react";
import AddMemberForm from "@/components/Member/Form";

interface OrgCardProps {
  org: FirestoreOrg & { id: string }; // Adding id since we need it for the link
}

const OrgCard: React.FC<OrgCardProps> = ({ org }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700">
            <HugeiconsIcon
              icon={Building01Icon}
              size={24}
              color="currentColor"
              strokeWidth={1.5}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {org.name}
            </h3>
            •
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {org.members?.length} members
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <VaulDrawer
          title="Add Member"
          trigger={<button className="btn sm">Add Member</button>}
          open={open}
          onOpenChange={setOpen}
        >
          <AddMemberForm orgId={org.id} onClose={() => setOpen(false)} />
        </VaulDrawer>
        <Link href={`/tasks/${org.id}`} className="btn primary sm">
          <span>View Tasks</span>
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            color="currentColor"
            strokeWidth={1.5}
            className="icon"
          />
        </Link>
      </div>
    </div>
  );
};

export default OrgCard;
