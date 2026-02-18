import React, { useState, useEffect, useRef } from 'react';
import { DataTable, type DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber, type InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { type Artwork, type ApiResponse } from '../types';

const ArtTable: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    
    const [manualSelections, setManualSelections] = useState<Record<number, boolean>>({});
    
    const [virtualCount, setVirtualCount] = useState<number>(0);
    const [customInput, setCustomInput] = useState<number | null>(null);
    
    const op = useRef<OverlayPanel>(null);
    const rowsPerPage = 12;

    const loadData = async (pageNumber: number) => {
        setLoading(true);
        try {
            const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=${rowsPerPage}`);
            const json: ApiResponse = await res.json();
            setArtworks(json.data || []);
            setTotalRecords(json.pagination.total);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(page);
    }, [page]);

    const handleCustomSubmit = () => {
        if (customInput === null || customInput <= 0) return;
        setVirtualCount(customInput);
        setManualSelections({}); 
        op.current?.hide();
    };
    const getSelectionForCurrentPage = () => {
        return artworks.filter((art, index) => {
            const globalIndex = ((page - 1) * rowsPerPage) + index + 1;
            
            if (manualSelections[art.id] !== undefined) {
                return manualSelections[art.id];
            }
            
            return globalIndex <= virtualCount;
        });
    };

    const totalSelectionCount = () => {
        const manualAdded = Object.values(manualSelections).filter(v => v === true).length;
        const manualRemoved = Object.values(manualSelections).filter(v => v === false).length;
        return Math.max(0, virtualCount + manualAdded - manualRemoved);
    };

    const footer = (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }}>
            <span>Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, totalRecords)} of {totalRecords} entries</span>
            <span style={{ fontWeight: 'bold' }}>{totalSelectionCount()} row(s) selected</span>
        </div>
    );

    return (
        <div className="card" style={{ margin: '20px' }}>
            <div style={{ marginBottom: '10px', fontWeight: '600' }}>
                Selected {totalSelectionCount()} rows
            </div>

            <DataTable
                value={artworks}
                lazy
                paginator
                rows={rowsPerPage}
                totalRecords={totalRecords}
                first={(page - 1) * rowsPerPage}
                onPage={(e: DataTableStateEvent) => setPage((e.page || 0) + 1)}
                loading={loading}
                dataKey="id"
                selectionMode="multiple"
                selection={getSelectionForCurrentPage()}
                onSelectionChange={(e) => {
                    const newManual = { ...manualSelections };
                    const currentSelection = e.value as Artwork[];
                    const selectedIdsOnPage = new Set(currentSelection.map(a => a.id));

                    artworks.forEach((art, index) => {
                        const globalIndex = ((page - 1) * rowsPerPage) + index + 1;
                        const isVirtuallySelected = globalIndex <= virtualCount;
                        const isCurrentlyChecked = selectedIdsOnPage.has(art.id);

                        if (isCurrentlyChecked !== isVirtuallySelected) {
                            newManual[art.id] = isCurrentlyChecked;
                        } else {
                            delete newManual[art.id]; 
                        }
                    });

                    setManualSelections(newManual);
                }}
                footer={footer}
            >
                <Column 
                    selectionMode="multiple" 
                    headerStyle={{ width: '3rem' }} 
                    header={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="pi pi-chevron-down" style={{ cursor: 'pointer', color: '#6366f1' }} onClick={(e) => op.current?.toggle(e)} />
                        </div>
                    }
                />
                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Origin" />
                <Column field="artist_display" header="Artist" />
                <Column field="inscriptions" header="Inscriptions" body={(rd: Artwork) => rd.inscriptions || "N/A"} />
                <Column field="date_start" header="Start Date" />
                <Column field="date_end" header="End Date" />
            </DataTable>

            <OverlayPanel ref={op} showCloseIcon>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>Select Multiple Rows</label>
                    <InputNumber 
                        value={customInput} 
                        onValueChange={(e: InputNumberValueChangeEvent) => setCustomInput(e.value ?? null)} 
                        placeholder="Enter row count..." 
                        inputStyle={{ width: '100%' }}
                    />
                    <Button label="Select" onClick={handleCustomSubmit} className="p-button-sm" />
                </div>
            </OverlayPanel>
        </div>
    );
};

export default ArtTable;