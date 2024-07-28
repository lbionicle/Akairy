

const SearchForm = ({onSubmitForm}) => {

    return (
        <form onSubmit={onSubmitForm} className="d-flex flex-wrap col-12 col-lg-6 m-auto py-1" id="search-office" action="" method="post">
            <div className="d-flex flex-wrap search-office-Area col-12">
                <div className="input-group mb-3">
                    <span className="input-group-text col-4">Площадь, м²</span>
                    <input name="minArea" type="number" min="0" onKeyPress={(event) => { if (event.key === 'e' || event.key === '-') { event.preventDefault(); }}} aria-label="minArea" placeholder="От" className="form-control" required />
                    <input name="maxArea" type="number" min="0" onKeyPress={(event) => { if (event.key === 'e' || event.key === '-') { event.preventDefault(); }}} aria-label="maxArea" placeholder="До" className="form-control" required />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text col-4">Цена, BYN</span>
                    <input name="minPrice" type="number" min="0" onKeyPress={(event) => { if (event.key === 'e' || event.key === '-') { event.preventDefault(); }}} aria-label="minPrice" placeholder="От" className="form-control" required />
                    <input name="maxPrice" type="number" min="0" onKeyPress={(event) => { if (event.key === 'e' || event.key === '-') { event.preventDefault(); }}} aria-label="maxPrice" placeholder="До" className="form-control" required />
                </div>
            </div>
            <div className="form-controls w-100 text-center mt-1">
                <button className="btn btn-submit btn-success col-12 col-lg-6 text-center" type="submit">Поиск</button>
            </div>
        </form>
    )
}

export default SearchForm;