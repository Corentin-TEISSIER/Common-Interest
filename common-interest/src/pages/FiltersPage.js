import React from "react";
import "../style/FiltersPage.css";
import BackButton from "../components/BackButton";
import AddFilterButton from "../components/AddFilterButton";
import AppContext from "../components/AppContext";
import AppMenu from "../components/AppMenu";

// COMMENT: another "delete" icon already exist... maybe more coherent to use it (its name is poubelle, I used it in connectedUser profile to delete interest)
import deletePng from "../public/icon/delete.png";

class FiltersPage extends React.Component {
  render() {
    // COMMENT: css -> on the scrollable container, add 'scrollbar-width: none;' to make scrollbar disapear
    // COMMENT: try also to fix space between menuebar and body page

    return (
      <div>
        <div id="filters-page-background">
          <BackButton to="/FriendsPage" />
          <div className="div-filtersPage">
            <AppContext.Consumer>
              {(props) => {
                return props.state.filters.map((e, i) => (
                  <div id="add-filter-button">
                    <div id="add-filter-button-filtersPage">
                      <div id="second">
                        <span>Filter #{i}</span>
                        <img
                          onClick={() => {
                            let filters = props.state.filters.filter(
                              (ee, idx) => i !== idx
                            );
                            props.setState({
                              filters: filters ?? [],
                            });
                          }}
                          src={deletePng}
                          alt="plus"
                        />
                      </div>
                      <div id="first">
                        <span className="value">{e.value}</span>
                      </div>
                    </div>
                  </div>
                ));
              }}
            </AppContext.Consumer>
          </div>

          <AddFilterButton
            setFilters={this.setFilters}
            to="/FriendsPage/FiltersPage/AddFilterPage"
          />
        </div>
        <div>
          <AppMenu icon="friends" />
        </div>
      </div>
    );
  }
}

export default FiltersPage;
