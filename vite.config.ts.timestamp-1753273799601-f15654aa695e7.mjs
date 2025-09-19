// vite.config.ts
import { vitePlugin as remix } from "file:///Users/ashutoshpalania/work/checkmate/node_modules/@remix-run/dev/dist/index.js";
import { installGlobals } from "file:///Users/ashutoshpalania/work/checkmate/node_modules/@remix-run/node/dist/index.js";
import { defineConfig } from "file:///Users/ashutoshpalania/work/checkmate/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/ashutoshpalania/work/checkmate/node_modules/vite-tsconfig-paths/dist/index.mjs";

// app/routes/utilities/api.ts
var API = /* @__PURE__ */ ((API2) => {
  API2["AddLabels"] = "api/v1/project/add-labels";
  API2["AddProjects"] = "api/v1/project/create";
  API2["AddRun"] = "api/v1/run/create";
  API2["AddSquads"] = "api/v1/project/add-squads";
  API2["AddTest"] = "api/v1/test/create";
  API2["AddTestBulk"] = "api/v1/test/bulk-add";
  API2["AddToken"] = "api/v1/token/generate";
  API2["DeleteBulkTests"] = "api/v1/test/bulk-delete";
  API2["DeleteRun"] = "api/v1/run/delete";
  API2["DeleteTest"] = "api/v1/test/delete";
  API2["DeleteToken"] = "api/v1/token/delete";
  API2["DownloadReport"] = "api/v1/run/report-download";
  API2["DownloadTests"] = "api/v1/tests/download";
  API2["EditProject"] = "api/v1/project/edit";
  API2["EditProjectStatus"] = "api/v1/project/update-status";
  API2["EditRun"] = "api/v1/run/edit";
  API2["EditTest"] = "api/v1/test/update";
  API2["EditTestsInBulk"] = "api/v1/test/bulk-update";
  API2["GetAutomationStatus"] = "api/v1/automation-status";
  API2["GetLabels"] = "api/v1/labels";
  API2["GetOrgDetails"] = "api/v1/org/detail";
  API2["GetOrgsList"] = "api/v1/orgs";
  API2["GetPlatforms"] = "api/v1/platform";
  API2["GetPriority"] = "api/v1/priority";
  API2["GetProjectDetail"] = "api/v1/project/detail";
  API2["GetProjects"] = "api/v1/projects";
  API2["GetRuns"] = "api/v1/runs";
  API2["GetRunStateDetail"] = "api/v1/run/state-detail";
  API2["GetRunTestsList"] = "api/v1/run/tests";
  API2["GetRunTestStatus"] = "api/v1/run/test-status";
  API2["GetSections"] = "api/v1/project/sections";
  API2["GetSquads"] = `api/v1/project/squads`;
  API2["GetTestCoveredBy"] = "api/v1/test-covered-by";
  API2["GetTestDetails"] = "api/v1/test/details";
  API2["GetTests"] = "api/v1/project/tests";
  API2["GetTestsCount"] = "api/v1/project/tests-count";
  API2["GetTestStatusHistory"] = "api/v1/test/test-status-history";
  API2["GetTestStatusHistoryInRun"] = "api/v1/run/test-status-history";
  API2["GetType"] = "api/v1/type";
  API2["GetUserDetails"] = "api/v1/user/details";
  API2["RunDetail"] = "api/v1/run/detail";
  API2["RunLock"] = "api/v1/run/lock";
  API2["RunRemoveTest"] = "api/v1/run/remove-tests";
  API2["RunReset"] = "api/v1/run/reset";
  API2["RunUpdateTestStatus"] = "api/v1/run/update-test-status";
  API2["GetAllUser"] = "api/v1/all-users";
  API2["UpdateUserRole"] = "api/v1/user/update-role";
  API2["AddSection"] = "api/v1/project/add-section";
  API2["EditSection"] = "api/v1/project/edit-section";
  API2["DeleteSection"] = "api/v1/project/delete-section";
  return API2;
})(API || {});
var API_RESOLUTION_PATHS = {
  ["api/v1/project/add-labels" /* AddLabels */]: "routes/api/v1/addLabels.ts",
  ["api/v1/project/create" /* AddProjects */]: "routes/api/v1/createProjects.ts",
  ["api/v1/run/create" /* AddRun */]: "routes/api/v1/createRun.ts",
  ["api/v1/project/add-squads" /* AddSquads */]: "routes/api/v1/addSquads.ts",
  ["api/v1/test/create" /* AddTest */]: "routes/api/v1/createTest.ts",
  ["api/v1/test/bulk-add" /* AddTestBulk */]: "routes/api/v1/bulkAddTest.ts",
  ["api/v1/token/generate" /* AddToken */]: "routes/api/v1/generateToken.ts",
  ["api/v1/test/bulk-delete" /* DeleteBulkTests */]: "routes/api/v1/bulkDeleteTests.ts",
  ["api/v1/run/delete" /* DeleteRun */]: "routes/api/v1/deleteRun.ts",
  ["api/v1/test/delete" /* DeleteTest */]: "routes/api/v1/deleteTest.ts",
  ["api/v1/token/delete" /* DeleteToken */]: "routes/api/v1/deleteToken.ts",
  ["api/v1/run/report-download" /* DownloadReport */]: "routes/api/v1/downloadReport.ts",
  ["api/v1/tests/download" /* DownloadTests */]: "routes/api/v1/downloadTests.ts",
  ["api/v1/project/edit" /* EditProject */]: "routes/api/v1/editProject.ts",
  ["api/v1/project/update-status" /* EditProjectStatus */]: "routes/api/v1/updateProjectStatus.ts",
  ["api/v1/run/edit" /* EditRun */]: "routes/api/v1/editRun.ts",
  ["api/v1/test/update" /* EditTest */]: "routes/api/v1/updateTest.ts",
  ["api/v1/test/bulk-update" /* EditTestsInBulk */]: "routes/api/v1/updateTests.ts",
  ["api/v1/automation-status" /* GetAutomationStatus */]: "routes/api/v1/automationStatus.ts",
  ["api/v1/labels" /* GetLabels */]: "routes/api/v1/labels.ts",
  ["api/v1/org/detail" /* GetOrgDetails */]: "routes/api/v1/org.ts",
  ["api/v1/orgs" /* GetOrgsList */]: "routes/api/v1/orgList.ts",
  ["api/v1/platform" /* GetPlatforms */]: "routes/api/v1/platform.ts",
  ["api/v1/priority" /* GetPriority */]: "routes/api/v1/priority.ts",
  ["api/v1/project/detail" /* GetProjectDetail */]: "routes/api/v1/projectData.ts",
  ["api/v1/projects" /* GetProjects */]: "routes/api/v1/projects.ts",
  ["api/v1/runs" /* GetRuns */]: "routes/api/v1/runs.ts",
  ["api/v1/run/state-detail" /* GetRunStateDetail */]: "routes/api/v1/runMetaInfo.ts",
  ["api/v1/run/tests" /* GetRunTestsList */]: "routes/api/v1/runTestsList.ts",
  ["api/v1/run/test-status" /* GetRunTestStatus */]: "routes/api/v1/testStatus.ts",
  ["api/v1/project/sections" /* GetSections */]: "routes/api/v1/sections.ts",
  ["api/v1/project/squads" /* GetSquads */]: "routes/api/v1/squads.ts",
  ["api/v1/test-covered-by" /* GetTestCoveredBy */]: "routes/api/v1/testCoveredBy.ts",
  ["api/v1/test/details" /* GetTestDetails */]: "routes/api/v1/testDetails.ts",
  ["api/v1/project/tests" /* GetTests */]: "routes/api/v1/tests.ts",
  ["api/v1/project/tests-count" /* GetTestsCount */]: "routes/api/v1/testsCount.ts",
  ["api/v1/test/test-status-history" /* GetTestStatusHistory */]: "routes/api/v1/testStatusHistory.ts",
  ["api/v1/run/test-status-history" /* GetTestStatusHistoryInRun */]: "routes/api/v1/testStatusHistoryOfRun.ts",
  ["api/v1/type" /* GetType */]: "routes/api/v1/type.ts",
  ["api/v1/user/details" /* GetUserDetails */]: "routes/api/v1/userDetails.ts",
  ["api/v1/run/detail" /* RunDetail */]: "routes/api/v1/runData.ts",
  ["api/v1/run/lock" /* RunLock */]: "routes/api/v1/lockRun.ts",
  ["api/v1/run/remove-tests" /* RunRemoveTest */]: "routes/api/v1/removeTestFromRun.ts",
  ["api/v1/run/reset" /* RunReset */]: "routes/api/v1/markPassedAsRetest.ts",
  ["api/v1/run/update-test-status" /* RunUpdateTestStatus */]: "routes/api/v1/updateStatusTestRuns.ts",
  ["api/v1/all-users" /* GetAllUser */]: "routes/api/v1/getAllUser.ts",
  ["api/v1/user/update-role" /* UpdateUserRole */]: "routes/api/v1/updateUserType.ts",
  ["api/v1/project/add-section" /* AddSection */]: "routes/api/v1/addSection.ts",
  ["api/v1/project/edit-section" /* EditSection */]: "routes/api/v1/editSection.ts",
  ["api/v1/project/delete-section" /* DeleteSection */]: "routes/api/v1/deleteSection.ts"
};
var CLOSED_API = {
  // GenerateToken: 'api/v1/generateToken',
};

// vite.config.ts
installGlobals();
var isProd = process.env.NODE_ENV === "production";
var vite_config_default = defineConfig({
  plugins: [
    remix({
      routes(defineRoutes) {
        return defineRoutes((route) => {
          Object.keys(API).forEach((key) => {
            const apiPath = API[key];
            const routePath = API_RESOLUTION_PATHS[apiPath];
            if (apiPath && routePath && !CLOSED_API[key]) {
              route(apiPath, routePath);
            }
          });
        });
      }
    }),
    tsconfigPaths(),
    ,
  ],
  esbuild: {
    target: "es2022"
  },
  build: {
    target: "es2022"
  },
  server: {
    port: 1200
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYXBwL3JvdXRlcy91dGlsaXRpZXMvYXBpLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2FzaHV0b3NocGFsYW5pYS93b3JrL2NoZWNrbWF0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FzaHV0b3NocGFsYW5pYS93b3JrL2NoZWNrbWF0ZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXNodXRvc2hwYWxhbmlhL3dvcmsvY2hlY2ttYXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHt2aXRlUGx1Z2luIGFzIHJlbWl4fSBmcm9tICdAcmVtaXgtcnVuL2RldidcbmltcG9ydCB7aW5zdGFsbEdsb2JhbHN9IGZyb20gJ0ByZW1peC1ydW4vbm9kZSdcbmltcG9ydCB7ZGVmaW5lQ29uZmlnfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocydcbmltcG9ydCB7QVBJLCBBUElfUkVTT0xVVElPTl9QQVRIUywgQ0xPU0VEX0FQSX0gZnJvbSAnLi9hcHAvcm91dGVzL3V0aWxpdGllcy9hcGknXG5cbmluc3RhbGxHbG9iYWxzKClcbmNvbnN0IGlzUHJvZCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlbWl4KHtcbiAgICAgIHJvdXRlcyhkZWZpbmVSb3V0ZXMpIHtcbiAgICAgICAgcmV0dXJuIGRlZmluZVJvdXRlcygocm91dGUpID0+IHtcbiAgICAgICAgICBPYmplY3Qua2V5cyhBUEkpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXBpUGF0aCA9IEFQSVtrZXkgYXMga2V5b2YgdHlwZW9mIEFQSV1cbiAgICAgICAgICAgIGNvbnN0IHJvdXRlUGF0aCA9XG4gICAgICAgICAgICAgIEFQSV9SRVNPTFVUSU9OX1BBVEhTW2FwaVBhdGggYXMga2V5b2YgdHlwZW9mIEFQSV9SRVNPTFVUSU9OX1BBVEhTXVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBhcGlQYXRoICYmXG4gICAgICAgICAgICAgIHJvdXRlUGF0aCAmJlxuICAgICAgICAgICAgICAhQ0xPU0VEX0FQSVtrZXkgYXMga2V5b2YgdHlwZW9mIENMT1NFRF9BUEldXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgcm91dGUoYXBpUGF0aCwgcm91dGVQYXRoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgIH0pLFxuICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgICAsXG4gIF0sXG4gIGVzYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlczIwMjInLFxuICB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzMjAyMicsXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDEyMDAsXG4gIH0sXG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYXNodXRvc2hwYWxhbmlhL3dvcmsvY2hlY2ttYXRlL2FwcC9yb3V0ZXMvdXRpbGl0aWVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYXNodXRvc2hwYWxhbmlhL3dvcmsvY2hlY2ttYXRlL2FwcC9yb3V0ZXMvdXRpbGl0aWVzL2FwaS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYXNodXRvc2hwYWxhbmlhL3dvcmsvY2hlY2ttYXRlL2FwcC9yb3V0ZXMvdXRpbGl0aWVzL2FwaS50c1wiO2V4cG9ydCBlbnVtIEFjY2Vzc1R5cGUge1xuICBSRUFERVIgPSAncmVhZGVyJyxcbiAgVVNFUiA9ICd1c2VyJyxcbiAgQURNSU4gPSAnYWRtaW4nLFxufVxuXG5leHBvcnQgZW51bSBBcGlUeXBlcyB7XG4gIEdFVCA9ICdHRVQnLFxuICBQT1NUID0gJ1BPU1QnLFxuICBQVVQgPSAnUFVUJyxcbiAgREVMRVRFID0gJ0RFTEVURScsXG59XG5cbmV4cG9ydCBlbnVtIEFQSSB7XG4gIEFkZExhYmVscyA9ICdhcGkvdjEvcHJvamVjdC9hZGQtbGFiZWxzJyxcbiAgQWRkUHJvamVjdHMgPSAnYXBpL3YxL3Byb2plY3QvY3JlYXRlJyxcbiAgQWRkUnVuID0gJ2FwaS92MS9ydW4vY3JlYXRlJyxcbiAgQWRkU3F1YWRzID0gJ2FwaS92MS9wcm9qZWN0L2FkZC1zcXVhZHMnLFxuICBBZGRUZXN0ID0gJ2FwaS92MS90ZXN0L2NyZWF0ZScsXG4gIEFkZFRlc3RCdWxrID0gJ2FwaS92MS90ZXN0L2J1bGstYWRkJyxcbiAgQWRkVG9rZW4gPSAnYXBpL3YxL3Rva2VuL2dlbmVyYXRlJyxcbiAgRGVsZXRlQnVsa1Rlc3RzID0gJ2FwaS92MS90ZXN0L2J1bGstZGVsZXRlJyxcbiAgRGVsZXRlUnVuID0gJ2FwaS92MS9ydW4vZGVsZXRlJyxcbiAgRGVsZXRlVGVzdCA9ICdhcGkvdjEvdGVzdC9kZWxldGUnLFxuICBEZWxldGVUb2tlbiA9ICdhcGkvdjEvdG9rZW4vZGVsZXRlJyxcbiAgRG93bmxvYWRSZXBvcnQgPSAnYXBpL3YxL3J1bi9yZXBvcnQtZG93bmxvYWQnLFxuICBEb3dubG9hZFRlc3RzID0gJ2FwaS92MS90ZXN0cy9kb3dubG9hZCcsXG4gIEVkaXRQcm9qZWN0ID0gJ2FwaS92MS9wcm9qZWN0L2VkaXQnLFxuICBFZGl0UHJvamVjdFN0YXR1cyA9ICdhcGkvdjEvcHJvamVjdC91cGRhdGUtc3RhdHVzJyxcbiAgRWRpdFJ1biA9ICdhcGkvdjEvcnVuL2VkaXQnLFxuICBFZGl0VGVzdCA9ICdhcGkvdjEvdGVzdC91cGRhdGUnLFxuICBFZGl0VGVzdHNJbkJ1bGsgPSAnYXBpL3YxL3Rlc3QvYnVsay11cGRhdGUnLFxuICBHZXRBdXRvbWF0aW9uU3RhdHVzID0gJ2FwaS92MS9hdXRvbWF0aW9uLXN0YXR1cycsXG4gIEdldExhYmVscyA9ICdhcGkvdjEvbGFiZWxzJyxcbiAgR2V0T3JnRGV0YWlscyA9ICdhcGkvdjEvb3JnL2RldGFpbCcsXG4gIEdldE9yZ3NMaXN0ID0gJ2FwaS92MS9vcmdzJyxcbiAgR2V0UGxhdGZvcm1zID0gJ2FwaS92MS9wbGF0Zm9ybScsXG4gIEdldFByaW9yaXR5ID0gJ2FwaS92MS9wcmlvcml0eScsXG4gIEdldFByb2plY3REZXRhaWwgPSAnYXBpL3YxL3Byb2plY3QvZGV0YWlsJyxcbiAgR2V0UHJvamVjdHMgPSAnYXBpL3YxL3Byb2plY3RzJyxcbiAgR2V0UnVucyA9ICdhcGkvdjEvcnVucycsXG4gIEdldFJ1blN0YXRlRGV0YWlsID0gJ2FwaS92MS9ydW4vc3RhdGUtZGV0YWlsJyxcbiAgR2V0UnVuVGVzdHNMaXN0ID0gJ2FwaS92MS9ydW4vdGVzdHMnLFxuICBHZXRSdW5UZXN0U3RhdHVzID0gJ2FwaS92MS9ydW4vdGVzdC1zdGF0dXMnLFxuICBHZXRTZWN0aW9ucyA9ICdhcGkvdjEvcHJvamVjdC9zZWN0aW9ucycsXG4gIEdldFNxdWFkcyA9IGBhcGkvdjEvcHJvamVjdC9zcXVhZHNgLFxuICBHZXRUZXN0Q292ZXJlZEJ5ID0gJ2FwaS92MS90ZXN0LWNvdmVyZWQtYnknLFxuICBHZXRUZXN0RGV0YWlscyA9ICdhcGkvdjEvdGVzdC9kZXRhaWxzJyxcbiAgR2V0VGVzdHMgPSAnYXBpL3YxL3Byb2plY3QvdGVzdHMnLFxuICBHZXRUZXN0c0NvdW50ID0gJ2FwaS92MS9wcm9qZWN0L3Rlc3RzLWNvdW50JyxcbiAgR2V0VGVzdFN0YXR1c0hpc3RvcnkgPSAnYXBpL3YxL3Rlc3QvdGVzdC1zdGF0dXMtaGlzdG9yeScsXG4gIEdldFRlc3RTdGF0dXNIaXN0b3J5SW5SdW4gPSAnYXBpL3YxL3J1bi90ZXN0LXN0YXR1cy1oaXN0b3J5JyxcbiAgR2V0VHlwZSA9ICdhcGkvdjEvdHlwZScsXG4gIEdldFVzZXJEZXRhaWxzID0gJ2FwaS92MS91c2VyL2RldGFpbHMnLFxuICBSdW5EZXRhaWwgPSAnYXBpL3YxL3J1bi9kZXRhaWwnLFxuICBSdW5Mb2NrID0gJ2FwaS92MS9ydW4vbG9jaycsXG4gIFJ1blJlbW92ZVRlc3QgPSAnYXBpL3YxL3J1bi9yZW1vdmUtdGVzdHMnLFxuICBSdW5SZXNldCA9ICdhcGkvdjEvcnVuL3Jlc2V0JyxcbiAgUnVuVXBkYXRlVGVzdFN0YXR1cyA9ICdhcGkvdjEvcnVuL3VwZGF0ZS10ZXN0LXN0YXR1cycsXG4gIEdldEFsbFVzZXIgPSAnYXBpL3YxL2FsbC11c2VycycsXG4gIFVwZGF0ZVVzZXJSb2xlID0gJ2FwaS92MS91c2VyL3VwZGF0ZS1yb2xlJyxcbiAgQWRkU2VjdGlvbiA9ICdhcGkvdjEvcHJvamVjdC9hZGQtc2VjdGlvbicsXG4gIEVkaXRTZWN0aW9uID0gJ2FwaS92MS9wcm9qZWN0L2VkaXQtc2VjdGlvbicsXG4gIERlbGV0ZVNlY3Rpb24gPSAnYXBpL3YxL3Byb2plY3QvZGVsZXRlLXNlY3Rpb24nLFxufVxuXG5leHBvcnQgY29uc3QgQVBJX1JFU09MVVRJT05fUEFUSFMgPSB7XG4gIFtBUEkuQWRkTGFiZWxzXTogJ3JvdXRlcy9hcGkvdjEvYWRkTGFiZWxzLnRzJyxcbiAgW0FQSS5BZGRQcm9qZWN0c106ICdyb3V0ZXMvYXBpL3YxL2NyZWF0ZVByb2plY3RzLnRzJyxcbiAgW0FQSS5BZGRSdW5dOiAncm91dGVzL2FwaS92MS9jcmVhdGVSdW4udHMnLFxuICBbQVBJLkFkZFNxdWFkc106ICdyb3V0ZXMvYXBpL3YxL2FkZFNxdWFkcy50cycsXG4gIFtBUEkuQWRkVGVzdF06ICdyb3V0ZXMvYXBpL3YxL2NyZWF0ZVRlc3QudHMnLFxuICBbQVBJLkFkZFRlc3RCdWxrXTogJ3JvdXRlcy9hcGkvdjEvYnVsa0FkZFRlc3QudHMnLFxuICBbQVBJLkFkZFRva2VuXTogJ3JvdXRlcy9hcGkvdjEvZ2VuZXJhdGVUb2tlbi50cycsXG4gIFtBUEkuRGVsZXRlQnVsa1Rlc3RzXTogJ3JvdXRlcy9hcGkvdjEvYnVsa0RlbGV0ZVRlc3RzLnRzJyxcbiAgW0FQSS5EZWxldGVSdW5dOiAncm91dGVzL2FwaS92MS9kZWxldGVSdW4udHMnLFxuICBbQVBJLkRlbGV0ZVRlc3RdOiAncm91dGVzL2FwaS92MS9kZWxldGVUZXN0LnRzJyxcbiAgW0FQSS5EZWxldGVUb2tlbl06ICdyb3V0ZXMvYXBpL3YxL2RlbGV0ZVRva2VuLnRzJyxcbiAgW0FQSS5Eb3dubG9hZFJlcG9ydF06ICdyb3V0ZXMvYXBpL3YxL2Rvd25sb2FkUmVwb3J0LnRzJyxcbiAgW0FQSS5Eb3dubG9hZFRlc3RzXTogJ3JvdXRlcy9hcGkvdjEvZG93bmxvYWRUZXN0cy50cycsXG4gIFtBUEkuRWRpdFByb2plY3RdOiAncm91dGVzL2FwaS92MS9lZGl0UHJvamVjdC50cycsXG4gIFtBUEkuRWRpdFByb2plY3RTdGF0dXNdOiAncm91dGVzL2FwaS92MS91cGRhdGVQcm9qZWN0U3RhdHVzLnRzJyxcbiAgW0FQSS5FZGl0UnVuXTogJ3JvdXRlcy9hcGkvdjEvZWRpdFJ1bi50cycsXG4gIFtBUEkuRWRpdFRlc3RdOiAncm91dGVzL2FwaS92MS91cGRhdGVUZXN0LnRzJyxcbiAgW0FQSS5FZGl0VGVzdHNJbkJ1bGtdOiAncm91dGVzL2FwaS92MS91cGRhdGVUZXN0cy50cycsXG4gIFtBUEkuR2V0QXV0b21hdGlvblN0YXR1c106ICdyb3V0ZXMvYXBpL3YxL2F1dG9tYXRpb25TdGF0dXMudHMnLFxuICBbQVBJLkdldExhYmVsc106ICdyb3V0ZXMvYXBpL3YxL2xhYmVscy50cycsXG4gIFtBUEkuR2V0T3JnRGV0YWlsc106ICdyb3V0ZXMvYXBpL3YxL29yZy50cycsXG4gIFtBUEkuR2V0T3Jnc0xpc3RdOiAncm91dGVzL2FwaS92MS9vcmdMaXN0LnRzJyxcbiAgW0FQSS5HZXRQbGF0Zm9ybXNdOiAncm91dGVzL2FwaS92MS9wbGF0Zm9ybS50cycsXG4gIFtBUEkuR2V0UHJpb3JpdHldOiAncm91dGVzL2FwaS92MS9wcmlvcml0eS50cycsXG4gIFtBUEkuR2V0UHJvamVjdERldGFpbF06ICdyb3V0ZXMvYXBpL3YxL3Byb2plY3REYXRhLnRzJyxcbiAgW0FQSS5HZXRQcm9qZWN0c106ICdyb3V0ZXMvYXBpL3YxL3Byb2plY3RzLnRzJyxcbiAgW0FQSS5HZXRSdW5zXTogJ3JvdXRlcy9hcGkvdjEvcnVucy50cycsXG4gIFtBUEkuR2V0UnVuU3RhdGVEZXRhaWxdOiAncm91dGVzL2FwaS92MS9ydW5NZXRhSW5mby50cycsXG4gIFtBUEkuR2V0UnVuVGVzdHNMaXN0XTogJ3JvdXRlcy9hcGkvdjEvcnVuVGVzdHNMaXN0LnRzJyxcbiAgW0FQSS5HZXRSdW5UZXN0U3RhdHVzXTogJ3JvdXRlcy9hcGkvdjEvdGVzdFN0YXR1cy50cycsXG4gIFtBUEkuR2V0U2VjdGlvbnNdOiAncm91dGVzL2FwaS92MS9zZWN0aW9ucy50cycsXG4gIFtBUEkuR2V0U3F1YWRzXTogJ3JvdXRlcy9hcGkvdjEvc3F1YWRzLnRzJyxcbiAgW0FQSS5HZXRUZXN0Q292ZXJlZEJ5XTogJ3JvdXRlcy9hcGkvdjEvdGVzdENvdmVyZWRCeS50cycsXG4gIFtBUEkuR2V0VGVzdERldGFpbHNdOiAncm91dGVzL2FwaS92MS90ZXN0RGV0YWlscy50cycsXG4gIFtBUEkuR2V0VGVzdHNdOiAncm91dGVzL2FwaS92MS90ZXN0cy50cycsXG4gIFtBUEkuR2V0VGVzdHNDb3VudF06ICdyb3V0ZXMvYXBpL3YxL3Rlc3RzQ291bnQudHMnLFxuICBbQVBJLkdldFRlc3RTdGF0dXNIaXN0b3J5XTogJ3JvdXRlcy9hcGkvdjEvdGVzdFN0YXR1c0hpc3RvcnkudHMnLFxuICBbQVBJLkdldFRlc3RTdGF0dXNIaXN0b3J5SW5SdW5dOiAncm91dGVzL2FwaS92MS90ZXN0U3RhdHVzSGlzdG9yeU9mUnVuLnRzJyxcbiAgW0FQSS5HZXRUeXBlXTogJ3JvdXRlcy9hcGkvdjEvdHlwZS50cycsXG4gIFtBUEkuR2V0VXNlckRldGFpbHNdOiAncm91dGVzL2FwaS92MS91c2VyRGV0YWlscy50cycsXG4gIFtBUEkuUnVuRGV0YWlsXTogJ3JvdXRlcy9hcGkvdjEvcnVuRGF0YS50cycsXG4gIFtBUEkuUnVuTG9ja106ICdyb3V0ZXMvYXBpL3YxL2xvY2tSdW4udHMnLFxuICBbQVBJLlJ1blJlbW92ZVRlc3RdOiAncm91dGVzL2FwaS92MS9yZW1vdmVUZXN0RnJvbVJ1bi50cycsXG4gIFtBUEkuUnVuUmVzZXRdOiAncm91dGVzL2FwaS92MS9tYXJrUGFzc2VkQXNSZXRlc3QudHMnLFxuICBbQVBJLlJ1blVwZGF0ZVRlc3RTdGF0dXNdOiAncm91dGVzL2FwaS92MS91cGRhdGVTdGF0dXNUZXN0UnVucy50cycsXG4gIFtBUEkuR2V0QWxsVXNlcl06ICdyb3V0ZXMvYXBpL3YxL2dldEFsbFVzZXIudHMnLFxuICBbQVBJLlVwZGF0ZVVzZXJSb2xlXTogJ3JvdXRlcy9hcGkvdjEvdXBkYXRlVXNlclR5cGUudHMnLFxuICBbQVBJLkFkZFNlY3Rpb25dOiAncm91dGVzL2FwaS92MS9hZGRTZWN0aW9uLnRzJyxcbiAgW0FQSS5FZGl0U2VjdGlvbl06ICdyb3V0ZXMvYXBpL3YxL2VkaXRTZWN0aW9uLnRzJyxcbiAgW0FQSS5EZWxldGVTZWN0aW9uXTogJ3JvdXRlcy9hcGkvdjEvZGVsZXRlU2VjdGlvbi50cycsXG59XG5cbmV4cG9ydCBjb25zdCBDTE9TRURfQVBJID0ge1xuICAvLyBHZW5lcmF0ZVRva2VuOiAnYXBpL3YxL2dlbmVyYXRlVG9rZW4nLFxufVxuXG5leHBvcnQgY29uc3QgQXBpVG9UeXBlTWFwOiB7XG4gIFtrZXkgaW4gQVBJXTogQXBpVHlwZXNcbn0gPSB7XG4gIFtBUEkuQWRkTGFiZWxzXTogQXBpVHlwZXMuUE9TVCxcbiAgW0FQSS5BZGRQcm9qZWN0c106IEFwaVR5cGVzLlBPU1QsXG4gIFtBUEkuQWRkUnVuXTogQXBpVHlwZXMuUE9TVCxcbiAgW0FQSS5BZGRTcXVhZHNdOiBBcGlUeXBlcy5QT1NULFxuICBbQVBJLkFkZFRlc3RdOiBBcGlUeXBlcy5QT1NULFxuICBbQVBJLkFkZFRlc3RCdWxrXTogQXBpVHlwZXMuUE9TVCxcbiAgW0FQSS5BZGRUb2tlbl06IEFwaVR5cGVzLlBPU1QsXG4gIFtBUEkuRGVsZXRlQnVsa1Rlc3RzXTogQXBpVHlwZXMuREVMRVRFLFxuICBbQVBJLkRlbGV0ZVJ1bl06IEFwaVR5cGVzLkRFTEVURSxcbiAgW0FQSS5EZWxldGVUZXN0XTogQXBpVHlwZXMuREVMRVRFLFxuICBbQVBJLkRlbGV0ZVRva2VuXTogQXBpVHlwZXMuREVMRVRFLFxuICBbQVBJLkRvd25sb2FkUmVwb3J0XTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkRvd25sb2FkVGVzdHNdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuRWRpdFByb2plY3RdOiBBcGlUeXBlcy5QVVQsXG4gIFtBUEkuRWRpdFByb2plY3RTdGF0dXNdOiBBcGlUeXBlcy5QVVQsXG4gIFtBUEkuRWRpdFJ1bl06IEFwaVR5cGVzLlBVVCxcbiAgW0FQSS5FZGl0VGVzdF06IEFwaVR5cGVzLlBVVCxcbiAgW0FQSS5FZGl0VGVzdHNJbkJ1bGtdOiBBcGlUeXBlcy5QVVQsXG4gIFtBUEkuR2V0QXV0b21hdGlvblN0YXR1c106IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRMYWJlbHNdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0T3JnRGV0YWlsc106IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRPcmdzTGlzdF06IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRQbGF0Zm9ybXNdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0UHJpb3JpdHldOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0UHJvamVjdERldGFpbF06IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRQcm9qZWN0c106IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRSdW5zXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFJ1blN0YXRlRGV0YWlsXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFJ1blRlc3RzTGlzdF06IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRSdW5UZXN0U3RhdHVzXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFNlY3Rpb25zXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFNxdWFkc106IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRUZXN0Q292ZXJlZEJ5XTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFRlc3REZXRhaWxzXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFRlc3RzXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFRlc3RzQ291bnRdOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0VGVzdFN0YXR1c0hpc3RvcnldOiBBcGlUeXBlcy5HRVQsXG4gIFtBUEkuR2V0VGVzdFN0YXR1c0hpc3RvcnlJblJ1bl06IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5HZXRUeXBlXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLkdldFVzZXJEZXRhaWxzXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLlJ1bkRldGFpbF06IEFwaVR5cGVzLkdFVCxcbiAgW0FQSS5SdW5Mb2NrXTogQXBpVHlwZXMuUFVULFxuICBbQVBJLlJ1blJlbW92ZVRlc3RdOiBBcGlUeXBlcy5QVVQsXG4gIFtBUEkuUnVuUmVzZXRdOiBBcGlUeXBlcy5QVVQsXG4gIFtBUEkuUnVuVXBkYXRlVGVzdFN0YXR1c106IEFwaVR5cGVzLlBVVCxcbiAgW0FQSS5HZXRBbGxVc2VyXTogQXBpVHlwZXMuR0VULFxuICBbQVBJLlVwZGF0ZVVzZXJSb2xlXTogQXBpVHlwZXMuUFVULFxuICBbQVBJLkFkZFNlY3Rpb25dOiBBcGlUeXBlcy5QT1NULFxuICBbQVBJLkVkaXRTZWN0aW9uXTogQXBpVHlwZXMuUFVULFxuICBbQVBJLkRlbGV0ZVNlY3Rpb25dOiBBcGlUeXBlcy5ERUxFVEUsXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlTLFNBQVEsY0FBYyxhQUFZO0FBQ25VLFNBQVEsc0JBQXFCO0FBQzdCLFNBQVEsb0JBQW1CO0FBQzNCLE9BQU8sbUJBQW1COzs7QUNVbkIsSUFBSyxNQUFMLGtCQUFLQSxTQUFMO0FBQ0wsRUFBQUEsS0FBQSxlQUFZO0FBQ1osRUFBQUEsS0FBQSxpQkFBYztBQUNkLEVBQUFBLEtBQUEsWUFBUztBQUNULEVBQUFBLEtBQUEsZUFBWTtBQUNaLEVBQUFBLEtBQUEsYUFBVTtBQUNWLEVBQUFBLEtBQUEsaUJBQWM7QUFDZCxFQUFBQSxLQUFBLGNBQVc7QUFDWCxFQUFBQSxLQUFBLHFCQUFrQjtBQUNsQixFQUFBQSxLQUFBLGVBQVk7QUFDWixFQUFBQSxLQUFBLGdCQUFhO0FBQ2IsRUFBQUEsS0FBQSxpQkFBYztBQUNkLEVBQUFBLEtBQUEsb0JBQWlCO0FBQ2pCLEVBQUFBLEtBQUEsbUJBQWdCO0FBQ2hCLEVBQUFBLEtBQUEsaUJBQWM7QUFDZCxFQUFBQSxLQUFBLHVCQUFvQjtBQUNwQixFQUFBQSxLQUFBLGFBQVU7QUFDVixFQUFBQSxLQUFBLGNBQVc7QUFDWCxFQUFBQSxLQUFBLHFCQUFrQjtBQUNsQixFQUFBQSxLQUFBLHlCQUFzQjtBQUN0QixFQUFBQSxLQUFBLGVBQVk7QUFDWixFQUFBQSxLQUFBLG1CQUFnQjtBQUNoQixFQUFBQSxLQUFBLGlCQUFjO0FBQ2QsRUFBQUEsS0FBQSxrQkFBZTtBQUNmLEVBQUFBLEtBQUEsaUJBQWM7QUFDZCxFQUFBQSxLQUFBLHNCQUFtQjtBQUNuQixFQUFBQSxLQUFBLGlCQUFjO0FBQ2QsRUFBQUEsS0FBQSxhQUFVO0FBQ1YsRUFBQUEsS0FBQSx1QkFBb0I7QUFDcEIsRUFBQUEsS0FBQSxxQkFBa0I7QUFDbEIsRUFBQUEsS0FBQSxzQkFBbUI7QUFDbkIsRUFBQUEsS0FBQSxpQkFBYztBQUNkLEVBQUFBLEtBQUEsZUFBWTtBQUNaLEVBQUFBLEtBQUEsc0JBQW1CO0FBQ25CLEVBQUFBLEtBQUEsb0JBQWlCO0FBQ2pCLEVBQUFBLEtBQUEsY0FBVztBQUNYLEVBQUFBLEtBQUEsbUJBQWdCO0FBQ2hCLEVBQUFBLEtBQUEsMEJBQXVCO0FBQ3ZCLEVBQUFBLEtBQUEsK0JBQTRCO0FBQzVCLEVBQUFBLEtBQUEsYUFBVTtBQUNWLEVBQUFBLEtBQUEsb0JBQWlCO0FBQ2pCLEVBQUFBLEtBQUEsZUFBWTtBQUNaLEVBQUFBLEtBQUEsYUFBVTtBQUNWLEVBQUFBLEtBQUEsbUJBQWdCO0FBQ2hCLEVBQUFBLEtBQUEsY0FBVztBQUNYLEVBQUFBLEtBQUEseUJBQXNCO0FBQ3RCLEVBQUFBLEtBQUEsZ0JBQWE7QUFDYixFQUFBQSxLQUFBLG9CQUFpQjtBQUNqQixFQUFBQSxLQUFBLGdCQUFhO0FBQ2IsRUFBQUEsS0FBQSxpQkFBYztBQUNkLEVBQUFBLEtBQUEsbUJBQWdCO0FBbEROLFNBQUFBO0FBQUEsR0FBQTtBQXFETCxJQUFNLHVCQUF1QjtBQUFBLEVBQ2xDLENBQUMsMkNBQWEsR0FBRztBQUFBLEVBQ2pCLENBQUMseUNBQWUsR0FBRztBQUFBLEVBQ25CLENBQUMsZ0NBQVUsR0FBRztBQUFBLEVBQ2QsQ0FBQywyQ0FBYSxHQUFHO0FBQUEsRUFDakIsQ0FBQyxrQ0FBVyxHQUFHO0FBQUEsRUFDZixDQUFDLHdDQUFlLEdBQUc7QUFBQSxFQUNuQixDQUFDLHNDQUFZLEdBQUc7QUFBQSxFQUNoQixDQUFDLCtDQUFtQixHQUFHO0FBQUEsRUFDdkIsQ0FBQyxtQ0FBYSxHQUFHO0FBQUEsRUFDakIsQ0FBQyxxQ0FBYyxHQUFHO0FBQUEsRUFDbEIsQ0FBQyx1Q0FBZSxHQUFHO0FBQUEsRUFDbkIsQ0FBQyxpREFBa0IsR0FBRztBQUFBLEVBQ3RCLENBQUMsMkNBQWlCLEdBQUc7QUFBQSxFQUNyQixDQUFDLHVDQUFlLEdBQUc7QUFBQSxFQUNuQixDQUFDLHNEQUFxQixHQUFHO0FBQUEsRUFDekIsQ0FBQywrQkFBVyxHQUFHO0FBQUEsRUFDZixDQUFDLG1DQUFZLEdBQUc7QUFBQSxFQUNoQixDQUFDLCtDQUFtQixHQUFHO0FBQUEsRUFDdkIsQ0FBQyxvREFBdUIsR0FBRztBQUFBLEVBQzNCLENBQUMsK0JBQWEsR0FBRztBQUFBLEVBQ2pCLENBQUMsdUNBQWlCLEdBQUc7QUFBQSxFQUNyQixDQUFDLCtCQUFlLEdBQUc7QUFBQSxFQUNuQixDQUFDLG9DQUFnQixHQUFHO0FBQUEsRUFDcEIsQ0FBQyxtQ0FBZSxHQUFHO0FBQUEsRUFDbkIsQ0FBQyw4Q0FBb0IsR0FBRztBQUFBLEVBQ3hCLENBQUMsbUNBQWUsR0FBRztBQUFBLEVBQ25CLENBQUMsMkJBQVcsR0FBRztBQUFBLEVBQ2YsQ0FBQyxpREFBcUIsR0FBRztBQUFBLEVBQ3pCLENBQUMsd0NBQW1CLEdBQUc7QUFBQSxFQUN2QixDQUFDLCtDQUFvQixHQUFHO0FBQUEsRUFDeEIsQ0FBQywyQ0FBZSxHQUFHO0FBQUEsRUFDbkIsQ0FBQyx1Q0FBYSxHQUFHO0FBQUEsRUFDakIsQ0FBQywrQ0FBb0IsR0FBRztBQUFBLEVBQ3hCLENBQUMsMENBQWtCLEdBQUc7QUFBQSxFQUN0QixDQUFDLHFDQUFZLEdBQUc7QUFBQSxFQUNoQixDQUFDLGdEQUFpQixHQUFHO0FBQUEsRUFDckIsQ0FBQyw0REFBd0IsR0FBRztBQUFBLEVBQzVCLENBQUMsZ0VBQTZCLEdBQUc7QUFBQSxFQUNqQyxDQUFDLDJCQUFXLEdBQUc7QUFBQSxFQUNmLENBQUMsMENBQWtCLEdBQUc7QUFBQSxFQUN0QixDQUFDLG1DQUFhLEdBQUc7QUFBQSxFQUNqQixDQUFDLCtCQUFXLEdBQUc7QUFBQSxFQUNmLENBQUMsNkNBQWlCLEdBQUc7QUFBQSxFQUNyQixDQUFDLGlDQUFZLEdBQUc7QUFBQSxFQUNoQixDQUFDLHlEQUF1QixHQUFHO0FBQUEsRUFDM0IsQ0FBQyxtQ0FBYyxHQUFHO0FBQUEsRUFDbEIsQ0FBQyw4Q0FBa0IsR0FBRztBQUFBLEVBQ3RCLENBQUMsNkNBQWMsR0FBRztBQUFBLEVBQ2xCLENBQUMsK0NBQWUsR0FBRztBQUFBLEVBQ25CLENBQUMsbURBQWlCLEdBQUc7QUFDdkI7QUFFTyxJQUFNLGFBQWE7QUFBQTtBQUUxQjs7O0FEbkhBLGVBQWU7QUFDZixJQUFNLFNBQVMsUUFBUSxJQUFJLGFBQWE7QUFFeEMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osT0FBTyxjQUFjO0FBQ25CLGVBQU8sYUFBYSxDQUFDLFVBQVU7QUFDN0IsaUJBQU8sS0FBSyxHQUFHLEVBQUUsUUFBUSxDQUFDLFFBQVE7QUFDaEMsa0JBQU0sVUFBVSxJQUFJLEdBQXVCO0FBQzNDLGtCQUFNLFlBQ0oscUJBQXFCLE9BQTRDO0FBQ25FLGdCQUNFLFdBQ0EsYUFDQSxDQUFDLFdBQVcsR0FBOEIsR0FDMUM7QUFDQSxvQkFBTSxTQUFTLFNBQVM7QUFBQSxZQUMxQjtBQUFBLFVBQ0YsQ0FBQztBQUFBLFFBQ0gsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxJQUNkO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbIkFQSSJdCn0K
