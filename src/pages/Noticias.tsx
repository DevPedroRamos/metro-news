
import React, { useState } from 'react';
import { FeaturedNews } from '@/components/news/FeaturedNews';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsListItem } from '@/components/news/NewsListItem';
import { CategoryFilter } from '@/components/news/CategoryFilter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Mock data
const featuredNews = {
  id: '1',
  title: 'Novo programa Minha Casa Minha Vida oferece condições especiais para primeira compra',
  description: 'O governo federal anunciou novas facilidades para quem deseja adquirir o primeiro imóvel através do programa habitacional.',
  image: '/public/lovable-uploads/181eacc0-0dbb-4e16-8c77-31c86f9c49d0.png',
  category: 'Minha Casa Minha Vida',
  date: '12 Jan 2024',
  author: 'Redação Metro News',
};

const latestNews = [
  {
    id: '2',
    title: 'Tendências de decoração para 2024: cores e estilos que estão em alta',
    description: 'Descubra as principais tendências de decoração que prometen dominar o mercado imobiliário este ano.',
    image: '/public/lovable-uploads/e694e1f5-9413-4775-bc42-153d43c49fa6.png',
    category: 'Decoração',
    date: '10 Jan 2024',
    author: 'Ana Santos',
  },
  {
    id: '3',
    title: 'Mercado imobiliário apresenta crescimento de 8% no último trimestre',
    description: 'Dados do setor mostram recuperação significativa nas vendas de imóveis residenciais.',
    image: '/public/lovable-uploads/181eacc0-0dbb-4e16-8c77-31c86f9c49d0.png',
    category: 'Mercado',
    date: '08 Jan 2024',
    author: 'Carlos Silva',
  },
  {
    id: '4',
    title: 'Novo empreendimento no centro da cidade oferece apartamentos a partir de R$ 180 mil',
    description: 'Lançamento conta com área de lazer completa e localização privilegiada próxima ao transporte público.',
    image: '/public/lovable-uploads/e694e1f5-9413-4775-bc42-153d43c49fa6.png',
    category: 'Empreendimento',
    date: '05 Jan 2024',
    author: 'Marina Costa',
  },
];

const categoryNews = [
  {
    id: '5',
    title: 'Como escolher o melhor financiamento imobiliário',
    description: 'Guia completo com dicas essenciais para tomar a melhor decisão na hora de financiar seu imóvel.',
    image: '/public/lovable-uploads/181eacc0-0dbb-4e16-8c77-31c86f9c49d0.png',
    category: 'Financiamento',
    date: '03 Jan 2024',
    author: 'Pedro Oliveira',
  },
  {
    id: '6',
    title: 'Regularização fundiária: entenda seus direitos',
    description: 'Saiba como funciona o processo de regularização e quais documentos são necessários.',
    image: '/public/lovable-uploads/e694e1f5-9413-4775-bc42-153d43c49fa6.png',
    category: 'Documentação',
    date: '01 Jan 2024',
    author: 'Julia Mendes',
  },
  {
    id: '7',
    title: 'Plantas de casas: como escolher o projeto ideal',
    description: 'Dicas importantes para escolher a planta que melhor se adapta às suas necessidades.',
    image: '/public/lovable-uploads/181eacc0-0dbb-4e16-8c77-31c86f9c49d0.png',
    category: 'Projetos',
    date: '30 Dez 2023',
    author: 'Roberto Lima',
  },
];

const mostReadNews = [
  {
    id: '8',
    title: 'Documentos necessários para compra do primeiro imóvel',
    description: 'Lista completa com toda documentação exigida no processo.',
    image: '/public/lovable-uploads/e694e1f5-9413-4775-bc42-153d43c49fa6.png',
    category: 'Documentação',
    date: '28 Dez 2023',
    author: 'Fernanda Rocha',
  },
  {
    id: '9',
    title: 'Investir em imóveis: vale a pena em 2024?',
    description: 'Análise do mercado e perspectivas para investimentos imobiliários.',
    image: '/public/lovable-uploads/181eacc0-0dbb-4e16-8c77-31c86f9c49d0.png',
    category: 'Investimento',
    date: '25 Dez 2023',
    author: 'Lucas Barbosa',
  },
  {
    id: '10',
    title: 'Reforma de apartamento: dicas para economizar',
    description: 'Como fazer uma reforma completa gastando menos.',
    image: '/public/lovable-uploads/e694e1f5-9413-4775-bc42-153d43c49fa6.png',
    category: 'Reforma',
    date: '22 Dez 2023',
    author: 'Patricia Alves',
  },
];

const categories = ['Minha Casa Minha Vida', 'Decoração', 'Empreendimento', 'Financiamento', 'Documentação', 'Projetos', 'Mercado'];

const Noticias = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredNews = selectedCategory === 'all' 
    ? categoryNews 
    : categoryNews.filter(news => news.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Notícias</h1>
        <p className="text-lg text-muted-foreground">
          Fique por dentro das últimas novidades da Metro News
        </p>
      </div>

      {/* Featured News */}
      <section>
        <FeaturedNews {...featuredNews} />
      </section>

      {/* Latest Content */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Últimos conteúdos</h2>
          <Button variant="outline" size="sm" className="group">
            Ver todos
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((news) => (
            <NewsCard key={news.id} {...news} />
          ))}
        </div>
      </section>

      {/* Content by Category */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Conteúdos por categoria</h2>
          <Button variant="outline" size="sm" className="group">
            Ver categoria completa
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="space-y-4">
          {filteredNews.map((news) => (
            <NewsListItem key={news.id} {...news} />
          ))}
        </div>
      </section>

      {/* Most Read */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Os mais lidos</h2>
          <Button variant="outline" size="sm" className="group">
            Ver todos
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="space-y-4">
          {mostReadNews.map((news) => (
            <NewsListItem key={news.id} {...news} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Noticias;
