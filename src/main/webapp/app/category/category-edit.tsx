import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { handleServerError, setYupDefaults } from 'app/common/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CategoryDTO } from 'app/category/category-model';
import axios from 'axios';
import InputRow from 'app/common/input-row/input-row';
import useDocumentTitle from 'app/common/use-document-title';
import * as yup from 'yup';


function getSchema() {
  setYupDefaults();
  return yup.object({
    name: yup.string().emptyToNull().max(100).required(),
    color: yup.string().emptyToNull().max(7)
  });
}

export default function CategoryEdit() {
  const { t } = useTranslation();
  useDocumentTitle(t('category.edit.headline'));

  const navigate = useNavigate();
  const params = useParams();
  const currentId = +params.id!;

  const useFormResult = useForm({
    resolver: yupResolver(getSchema()),
  });

  const getMessage = (key: string) => {
    const messages: Record<string, string> = {
      CATEGORY_NAME_UNIQUE: t('exists.category.name')
    };
    return messages[key];
  };

  const prepareForm = async () => {
    try {
      const data = (await axios.get('/api/categories/' + currentId)).data;
      useFormResult.reset(data);
    } catch (error: any) {
      handleServerError(error, navigate);
    }
  };

  useEffect(() => {
    prepareForm();
  }, []);

  const updateCategory = async (data: CategoryDTO) => {
    window.scrollTo(0, 0);
    try {
      await axios.put('/api/categories/' + currentId, data);
      navigate('/categories', {
            state: {
              msgSuccess: t('category.update.success')
            }
          });
    } catch (error: any) {
      handleServerError(error, navigate, useFormResult.setError, t, getMessage);
    }
  };

  return (<>
    <div className="d-flex flex-wrap mb-4">
      <h1 className="flex-grow-1">{t('category.edit.headline')}</h1>
      <div>
        <Link to="/categories" className="btn btn-secondary">{t('category.edit.back')}</Link>
      </div>
    </div>
    <form onSubmit={useFormResult.handleSubmit(updateCategory)} noValidate>
      <InputRow useFormResult={useFormResult} object="category" field="id" disabled={true} type="number" />
      <InputRow useFormResult={useFormResult} object="category" field="name" required={true} />
      <InputRow useFormResult={useFormResult} object="category" field="color" />
      <input type="submit" value={t('category.edit.headline')} className="btn btn-primary mt-4" />
    </form>
  </>);
}
