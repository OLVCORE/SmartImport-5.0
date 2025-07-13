import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Edit3, Save, X as Cancel } from 'lucide-react'

const ProductDetailsModal = ({ isOpen, onClose, products, onSave, onAnalyzeNCM }) => {
  const [editingProducts, setEditingProducts] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)

  useEffect(() => {
    if (products && products.length > 0) {
      setEditingProducts(products.map((product, index) => ({
        ...product,
        id: index,
        isEditing: false
      })))
    }
  }, [products])

  const handleEdit = (index) => {
    setEditingIndex(index)
    setEditingProducts(prev => prev.map((product, i) => ({
      ...product,
      isEditing: i === index
    })))
  }

  const handleSave = (index) => {
    setEditingIndex(null)
    setEditingProducts(prev => prev.map((product, i) => ({
      ...product,
      isEditing: false
    })))
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setEditingProducts(prev => prev.map(product => ({
      ...product,
      isEditing: false
    })))
  }

  const handleChange = (index, field, value) => {
    setEditingProducts(prev => prev.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ))
  }

  const handleAddProduct = () => {
    const newProduct = {
      id: editingProducts.length,
      numero: editingProducts.length + 1,
      quantidade: 1,
      descricao: '',
      valorUnitario: 0,
      valorTotal: 0,
      observacoes: '',
      isEditing: true
    }
    setEditingProducts(prev => [...prev, newProduct])
    setEditingIndex(editingProducts.length)
  }

  const handleRemoveProduct = (index) => {
    setEditingProducts(prev => prev.filter((_, i) => i !== index))
    if (editingIndex === index) {
      setEditingIndex(null)
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1)
    }
  }

  const handleSaveAll = () => {
    const cleanedProducts = editingProducts.map(product => {
      const { isEditing, id, ...cleanProduct } = product
      return cleanProduct
    })
    onSave(cleanedProducts)
    onClose()
  }

  const handleAnalyzeNCM = (index) => {
    const product = editingProducts[index]
    onAnalyzeNCM(product)
  }

  const calculateTotal = (quantidade, valorUnitario) => {
    return (parseFloat(quantidade) || 0) * (parseFloat(valorUnitario) || 0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalhes dos Produtos</h2>
            <p className="text-green-700 font-semibold mt-1">
              {editingProducts.length} produto{editingProducts.length !== 1 ? 's' : ''} encontrado{editingProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Adicionar Produto
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {editingProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
                <button
                  onClick={handleAddProduct}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus size={16} />
                  Adicionar Primeiro Produto
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <table className="min-w-full divide-y divide-gray-200 mt-4">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">NCM</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valor Unitário</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {editingProducts.map((product, index) => (
                      <tr key={product.id}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{product.descricao}</td>
                        <td className="px-4 py-2">{product.ncm}</td>
                        <td className="px-4 py-2">{product.quantidade}</td>
                        <td className="px-4 py-2">{Number(product.valorUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })}</td>
                        <td className="px-4 py-2">{(product.quantidade * product.valorUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {editingProducts.length} produto{editingProducts.length !== 1 ? 's' : ''} encontrado{editingProducts.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAll}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar e Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsModal 