import React from 'react'

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    {/* Header e Sidebar são renderizados fora deste componente */}
    <main className="flex-1 pb-8">{children}</main>
    {/* Rodapé sempre no final */}
    <Footer />
  </div>
)

export default Layout 