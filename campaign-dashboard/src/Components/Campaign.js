import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import mockData from '../data/mockCampaigns';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const Campaign = () => {
  const gridRef = useRef();
  const [rowData, setRowData] = useState(mockData);
  const [bulkStatus, setBulkStatus] = useState('');

  const columnDefs = useMemo(() => [
  {
    field: 'CampaignId',
    headerName: 'ID',
    minWidth: 100,
  },
  { field: 'CampaignName', sortable: true, filter: true, editable: true },
  { field: 'ClientName', sortable: true, filter: true, editable: true },
  { field: 'StartDate', sortable: true, filter: true },
  { field: 'EndDate', sortable: true, filter: true },
  {
    field: 'Status',
    sortable: true,
    filter: true,
    editable: true,
    cellStyle: (params) => {
      switch (params.value) {
        case 'Draft': return { backgroundColor: '#f0f0f0' };
        case 'Scheduled': return { backgroundColor: '#fff7e6' };
        case 'Active': return { backgroundColor: '#e6ffed' };
        case 'Completed': return { backgroundColor: '#e6f0ff' };
        case 'Cancelled': return { backgroundColor: '#ffe6e6' };
        default: return null;
      }
    }
  },
  {
    field: 'Budget',
    sortable: true,
    filter: true,
    editable: true,
    cellStyle: (params) =>
      params.value > 40000
        ? { backgroundColor: '#ffe0e0', fontWeight: 'bold' }
        : null,
  },
  { field: 'Spent', sortable: true, filter: true },
  { field: 'Impressions', sortable: true, filter: true },
  { field: 'Clicks', sortable: true, filter: true },
  {
    field: 'ConversionRate',
    sortable: true,
    filter: true,
    cellStyle: (params) =>
      parseFloat(params.value) < 1
        ? { color: 'red', fontWeight: 'bold' }
        : null,
  },
  { field: 'Channel', sortable: true, filter: true },
  { field: 'Manager', sortable: true, filter: true },
  {
    field: 'Thumbnail',
    headerName: 'Thumbnail',
    cellRenderer: (params) =>
      `<img src="${params.value}" alt="thumb" height="40"/>`,
  },
  { field: 'LastModified', sortable: true, filter: true }
], []);


  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    editable: true,
    flex: 1,
    minWidth: 120,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    suppressMenu: false,
  };

  const handleBulkUpdate = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api || !bulkStatus) return;

    const selectedRows = api.getSelectedRows();
    if (selectedRows.length === 0) {
      alert('No rows selected.');
      return;
    }

    const updatedRows = selectedRows.map(row => ({
      ...row,
      Status: bulkStatus,
    }));

    // Update rowData state (for reactivity)
    const updatedData = rowData.map(row => {
      const updated = updatedRows.find(u => u.CampaignId === row.CampaignId);
      return updated ? updated : row;
    });

    setRowData(updatedData);

    // Optional: instantly apply changes to the grid
    api.setRowData(updatedData);

    // Clear selection
    api.deselectAll();

    // Clear bulk status
    setBulkStatus('');
  }, [bulkStatus, rowData]);



  return (

    <div>
        <div style={{ marginBottom: 10 }}>
            <label style={{ marginRight: 10 }}>Bulk Update Status:</label>
            <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
            <option value="">-- Select Status --</option>
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            </select>
            <button
            style={{ marginLeft: 10 }}
            onClick={handleBulkUpdate}
            disabled={!bulkStatus}
            >
            Apply to Selected
            </button>
        </div>

        <div className="ag-theme-alpine" style={{ height: '85vh', width: '100%' }}>
        <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={20}
            animateRows={true}
            rowSelection={{
              checkboxes:true,
              headerCheckbox:true,
              mode:'multiRow'
            }}
            suppressDragLeaveHidesColumns={true}
            suppressGroupChangesColumnVisibility="supressShowOnUngroup"
            enableBrowserTooltips={true}
            sideBar={{
            toolPanels: [
            {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
            },
            ],
            defaultToolPanel: 'columns',
        }}
        />
        </div>
    </div>
  );
};

export default Campaign;
