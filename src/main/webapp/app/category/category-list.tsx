import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { handleServerError } from 'app/common/utils';
import { CategoryDTO } from 'app/category/category-model';
import axios from 'axios';
import useDocumentTitle from 'app/common/use-document-title';


export default function CategoryList() {
  const { t } = useTranslation();
  useDocumentTitle(t('category.list.headline'));

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const navigate = useNavigate();

  const getAllCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  const confirmDelete = async (id: number) => {
    if (!confirm(t('delete.confirm'))) {
      return;
    }
    try {
      await axios.delete('/api/categories/' + id);
      navigate('/categories', {
            state: {
              msgInfo: t('category.delete.success')
            }
          });
      getAllCategories();
    } catch (error: any) {
      if (error?.response?.data?.code === 'REFERENCED') {
        const messageParts = error.response.data.message.split(',');
        navigate('/categories', {
              state: {
                msgError: t(messageParts[0]!, { id: messageParts[1]! })
              }
            });
        return;
      }
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('category.list.headline')}</h1>
      <div>
        <Link to="/categories/add" className="btn btn-primary ms-2">{t('category.list.createNew')}</Link>
      </div>
    </div>
    {!categories || categories.length === 0 ? (
    <div>{t('category.list.empty')}</div>
    ) : (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">{t('category.id.label')}</th>
            <th scope="col">{t('category.name.label')}</th>
            <th scope="col">{t('category.color.label')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
          <tr key={category.id}>
            <td>{category.id}</td>
            <td>{category.name}</td>
            <td>{category.color}</td>
            <td>
              <div className="float-end text-nowrap">
                <Link to={'/categories/edit/' + category.id} className="btn btn-sm btn-secondary">{t('category.list.edit')}</Link>
                <span> </span>
                <button type="button" onClick={() => confirmDelete(category.id!)} className="btn btn-sm btn-secondary">{t('category.list.delete')}</button>
              </div>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
    )}
  </>);
}
