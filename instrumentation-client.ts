// Runs before the app's frontend code starts executing (Next.js client instrumentation hook).
// Used to set up global analytics — see app/layout.tsx for Google Analytics.
import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

if (CLARITY_PROJECT_ID) {
  Clarity.init(CLARITY_PROJECT_ID);
}
