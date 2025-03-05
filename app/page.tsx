"use client";

import OrgList from "@/components/Org/List";

export default function Home() {
  return (
    <main>
      <section className="site-section">
        <div className="wrapper">
          <OrgList />
        </div>
      </section>
    </main>
  );
}
