<BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />

    <Route element={<MainLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/purchase" element={<PurchaseEntry />} />
      <Route path="/suppliers" element={<SupplierList />} />
      <Route path="/items" element={<ItemList />} />
      <Route path="/stock" element={<StockSummary />} />
      <Route path="/sales" element={<SalesEntry />} />
    </Route>
  </Routes>
</BrowserRouter>