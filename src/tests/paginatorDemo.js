import React, { useState } from 'react';
import { Paginator } from 'primereact/paginator';

export default function PaginatorProdutos() {
    const [basicFirst, setBasicFirst] = useState(0);
    const [basicRows, setBasicRows] = useState(10);

    const onBasicPageChange = (event) => {
        setBasicFirst(event.first);
        setBasicRows(event.rows);
    }

    return (
        <Paginator first={basicFirst} rows={basicRows} totalRecords={120} rowsPerPageOptions={[10, 20, 30]} onPageChange={onBasicPageChange}></Paginator>
    );
}