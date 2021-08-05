import React, { useEffect, useState } from 'react';
import './App.css';
import Tmbd from './tmdb';
import MovieRow from './components/MovieRow';
import FeatureMovie from './components/FeatureMovie';
import Header from './components/Header';

export default () => {
	const [movieList, setMovieList] = useState([]);
	const [featureData, setFeatureData] = useState(null);
	const [blackHeader, setBlackHeader] = useState(false);

	useEffect(() => {
		const loadAll = async () => {
			// Pegando a lista total
			let list = await Tmbd.getHomeList();
			setMovieList(list);

			// Pegando o feature
			let originals = list.filter(i => i.slug === 'originals');
			let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
			let chosen = originals[0].items.results[randomChosen];
			let chosenInfo = await Tmbd.getMovieInfo(chosen.id, 'tv');
			setFeatureData(chosenInfo);
		}

		loadAll();
	}, []);

	useEffect(() => {
		const scrollListener = () => {
			if(window.scrollY > 35) {
				setBlackHeader(true);
			}else {
				setBlackHeader(false);
			}
		}

		window.addEventListener('scroll', scrollListener);

		return () => {
			window.removeEventListener('scroll', scrollListener);
		}
	}, []);

  return (
    <div className="page">
			<Header black={blackHeader} />
			{featureData &&
				<FeatureMovie item={featureData} />
			}
      <section className="lists">
				{
					movieList.map((item, key) => (
						<div key={key}>
							<MovieRow key={key} title={item.title} items={item.items} />
						</div>
					))
				}
			</section>
			<footer>
				<p>Desenvolvido por Alex Amaral</p>
				<p className="footer--email">alexsamaralns@gmail.com</p>
			</footer>
			{movieList.length <= 0 &&
				<div className="loading">
					<img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando" />
				</div>
			}
    </div>
  );
}