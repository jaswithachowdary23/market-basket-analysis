import { useState, useEffect } from "react";
import Papa from "papaparse";
import "./App.css";

const stats = [
  { value: "5,000", label: "Records Analyzed" },
  { value: "221", label: "Transactions" },
  { value: "1,797", label: "Products" },
  { value: "76", label: "Association Rules" },
];

const rules = [
  {
    from: "LUNCH BAG WOODLAND + LUNCH BAG SUKI DESIGN",
    to: "LUNCH BAG RED RETROSPOT",
    confidence: "100%",
    lift: "13.00",
  },
  {
    from: "LUNCH BAG CARS BLUE",
    to: "LUNCH BAG RED RETROSPOT",
    confidence: "75%",
    lift: "9.75",
  },
  {
    from: "LUNCH BAG SUKI DESIGN",
    to: "LUNCH BAG CARS BLUE",
    confidence: "68%",
    lift: "8.84",
  },
  {
    from: "LUNCH BAG RED RETROSPOT",
    to: "LUNCH BAG WOODLAND",
    confidence: "64%",
    lift: "8.32",
  },
];

const pipeline = [
  {
    number: "01",
    title: "Data Cleaning",
    text: "Removed invalid records and prepared the Online Retail dataset.",
  },
  {
    number: "02",
    title: "Transformation",
    text: "Converted transaction data into a binary basket format.",
  },
  {
    number: "03",
    title: "Apriori",
    text: "Identified frequently purchased product combinations.",
  },
  {
    number: "04",
    title: "Association Rules",
    text: "Generated rules using support, confidence and lift.",
  },
];

function App() {
  const [active, setActive] = useState("Dashboard");
  const [rulesData, setRulesData] = useState([]);
  const [cooccurrenceData, setCooccurrenceData] = useState([]);
  const [product, setProduct] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRules, setLoadingRules] = useState(true);
  const [csvError, setCsvError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/data/association_rules.csv").then((response) => {
        if (!response.ok) {
          throw new Error("Could not load association_rules.csv");
        }
        return response.text();
      }),
      fetch("/data/cooccurrence_recommendations.csv").then((response) => {
        if (!response.ok) {
          throw new Error("Could not load cooccurrence_recommendations.csv");
        }
        return response.text();
      }),
    ])
      .then(([rulesCsv, cooccurrenceCsv]) => {
        const rulesResult = Papa.parse(rulesCsv, {
          header: true,
          skipEmptyLines: true,
        });

        const cooccurrenceResult = Papa.parse(cooccurrenceCsv, {
          header: true,
          skipEmptyLines: true,
        });

        setRulesData(rulesResult.data);
        setCooccurrenceData(cooccurrenceResult.data);
        setCsvError("");
      })
      .catch((error) => {
        console.error(error);
        setCsvError("Recommendation files could not be loaded.");
      })
      .finally(() => {
        setLoadingRules(false);
      });
  }, []);

  const cleanItemText = (value = "") =>
    String(value)
      .replace(/frozenset\(\{?|\}?\)/gi, "")
      .replace(/[{}']/g, "")
      .trim();

  const getRecommendations = () => {
    const search = product.trim().toLowerCase();

    if (!search) {
      setRecommendations([]);
      return;
    }

    // First, search the Apriori association rules.
    const aprioriResults = rulesData
      .filter((rule) =>
        cleanItemText(rule.antecedents)
          .toLowerCase()
          .includes(search)
      )
      .sort((a, b) => {
        const confidenceA = Number(a.confidence) || 0;
        const confidenceB = Number(b.confidence) || 0;
        const liftA = Number(a.lift) || 0;
        const liftB = Number(b.lift) || 0;

        return confidenceB - confidenceA || liftB - liftA;
      })
      .slice(0, 5)
      .map((rule) => ({
        type: "apriori",
        antecedents: cleanItemText(rule.antecedents),
        consequents: cleanItemText(rule.consequents),
        support: Number(rule.support) || 0,
        confidence: Number(rule.confidence) || 0,
        lift: Number(rule.lift) || 0,
      }));

    // If Apriori rules exist, show them.
    if (aprioriResults.length > 0) {
      setRecommendations(aprioriResults);
      return;
    }

    // Otherwise, use the co-occurrence fallback recommendations.
    const fallbackResults = cooccurrenceData
      .filter((item) =>
        String(item.product)
          .toLowerCase()
          .includes(search)
      )
      .sort(
        (a, b) => Number(b.transactions) - Number(a.transactions)
      )
      .slice(0, 5)
      .map((item) => ({
        type: "cooccurrence",
        product: item.product,
        recommended: item.recommended,
        transactions: Number(item.transactions) || 0,
      }));

    setRecommendations(fallbackResults);
  };

  const changePage = (page) => {
    setActive(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo" onClick={() => changePage("Dashboard")}>
          <div className="logo-mark">MB</div>
          <div>
            <span>Market</span>
            <strong>Basket</strong>
          </div>
        </div>

        <div className="nav-links">
          {[
            "Dashboard",
            "Analysis",
            "Rules",
            "Visualizations",
            "Recommendations",
            "Insights",
          ].map((item) => (
            <button
              key={item}
              className={active === item ? "nav-active" : ""}
              onClick={() => changePage(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="status">
          <span></span> Analysis Ready
        </div>
      </nav>

      {/* DASHBOARD */}
      {active === "Dashboard" && (
        <main>

          <section className="hero">
            <div className="hero-content">
              <div className="eyebrow">
                DATA MINING PROJECT • MARKET BASKET ANALYSIS
              </div>

              <h1>
                Discover what
                <span> customers buy together.</span>
              </h1>

              <p>
                An interactive analysis of retail transactions using
                Apriori algorithm and association rule mining to discover
                meaningful product relationships.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-btn"
                  onClick={() => changePage("Analysis")}
                >
                  Explore Analysis →
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => changePage("Recommendations")}
                >
                  View Recommendations
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="orb">
                <div className="orb-inner"></div>

                <div className="floating-card card-one">
                  <small>CONFIDENCE</small>
                  <strong>100%</strong>
                </div>

                <div className="floating-card card-two">
                  <small>MAX LIFT</small>
                  <strong>13.00</strong>
                </div>

                <div className="floating-card card-three">
                  <small>RULES</small>
                  <strong>76</strong>
                </div>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="stats-section">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </section>

          {/* PIPELINE */}
          <section className="section">
            <div className="section-heading">
              <div>
                <span className="section-label">THE PROCESS</span>
                <h2>From raw data to useful insights.</h2>
              </div>
              <p>
                A simple data mining workflow designed to identify
                purchasing patterns.
              </p>
            </div>

            <div className="pipeline">
              {pipeline.map((item) => (
                <div className="pipeline-card" key={item.number}>
                  <span className="pipeline-number">{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="arrow">↗</div>
                </div>
              ))}
            </div>
          </section>

          {/* KEY DISCOVERY */}
          <section className="discovery">
            <div>
              <span className="section-label">KEY DISCOVERY</span>
              <h2>
                Strong product relationships
                <br />
                can drive smarter recommendations.
              </h2>
              <p>
                The strongest rule in the analyzed sample has a confidence
                of 100% and a lift of 13.00.
              </p>
            </div>

            <div className="discovery-rule">
              <div className="rule-box">
                <small>IF CUSTOMER BUYS</small>
                <strong>
                  LUNCH BAG WOODLAND
                  <br />
                  +
                  <br />
                  LUNCH BAG SUKI DESIGN
                </strong>
              </div>

              <div className="rule-arrow">→</div>

              <div className="rule-box highlight">
                <small>RECOMMEND</small>
                <strong>LUNCH BAG RED RETROSPOT</strong>
                <div className="rule-metrics">
                  <span>Confidence 100%</span>
                  <span>Lift 13.00</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ANALYSIS */}
      {active === "Analysis" && (
        <Page title="Data Analysis" subtitle="Understanding the prepared retail dataset.">

          <div className="metric-grid">
            <Metric title="Original Records" value="541,909" />
            <Metric title="Analyzed Records" value="5,000" />
            <Metric title="Transactions" value="221" />
            <Metric title="Products" value="1,797" />
          </div>

          <div className="content-grid">
            <InfoCard
              title="Dataset Cleaning"
              text="The original Online Retail dataset was cleaned and a 5,000-row sample was selected for analysis. Invalid transaction records were removed before processing."
            />

            <InfoCard
              title="Data Transformation"
              text="Transaction data was converted into a basket matrix where each row represents a transaction and each product becomes a binary purchase indicator."
            />

            <InfoCard
              title="Apriori Mining"
              text="The Apriori algorithm was applied with a minimum support of 0.04 and maximum itemset length of 3."
            />

            <InfoCard
              title="Rule Filtering"
              text="Rules were filtered using support, confidence and lift to focus on meaningful positive associations."
            />
          </div>

          <div className="big-stat">
            <div>
              <span>Average Support</span>
              <strong>0.053</strong>
            </div>
            <div>
              <span>Average Confidence</span>
              <strong>0.631</strong>
            </div>
            <div>
              <span>Average Lift</span>
              <strong>8.484</strong>
            </div>
          </div>

        </Page>
      )}

      {/* RULES */}
      {active === "Rules" && (
        <Page title="Association Rules" subtitle="Product relationships discovered using Apriori.">

          <div className="rule-table">
            <div className="table-header">
              <span>IF CUSTOMER BUYS</span>
              <span>RECOMMEND</span>
              <span>CONFIDENCE</span>
              <span>LIFT</span>
            </div>

            {rules.map((rule, index) => (
              <div className="table-row" key={index}>
                <span>{rule.from}</span>
                <span>{rule.to}</span>
                <strong>{rule.confidence}</strong>
                <strong>{rule.lift}</strong>
              </div>
            ))}
          </div>

          <div className="explanation-card">
            <h3>How to read these rules</h3>
            <p>
              <b>Support</b> indicates how frequently an item combination
              appears. <b>Confidence</b> measures how often the consequent
              appears when the antecedent is purchased. <b>Lift</b> measures
              how much stronger the relationship is compared with random
              purchasing.
            </p>
          </div>

        </Page>
      )}

      {/* VISUALIZATIONS */}
      {active === "Visualizations" && (
        <Page title="Visualizations" subtitle="Visual representation of the mining results.">

          <div className="visual-grid">
            <Visual
              title="Top Products by Support"
              file="/visualizations/top_products_support.png"
            />

            <Visual
              title="Top Rules by Confidence"
              file="/visualizations/top_rules_confidence.png"
            />

            <Visual
              title="Top Rules by Lift"
              file="/visualizations/top_rules_lift.png"
            />

            <Visual
              title="Support vs Confidence"
              file="/visualizations/support_vs_confidence.png"
            />
          </div>

        </Page>
      )}

      {/* RECOMMENDATIONS */}
      {active === "Recommendations" && (
        <Page
          title="Product Recommendations"
          subtitle="Discover products that are commonly purchased together."
        >
          <div className="recommend-box">
            <div className="search-icon">⌕</div>

            <div className="recommend-content">
              <span>RECOMMENDATION ENGINE</span>

              <h2>What should the customer buy next?</h2>

              <p>
                Enter a product name to find related products using the
                association rules generated from the retail dataset.
              </p>

              <div className="recommend-search">
                <input
                  type="text"
                  placeholder="Example: LUNCH BAG"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getRecommendations();
                    }
                  }}
                />

                <button onClick={getRecommendations}>
                  Search
                </button>
              </div>
            </div>
          </div>

          {loadingRules ? (
            <div className="no-results">
              <h3>Loading recommendation engine...</h3>
              <p>Please wait while the recommendation data is loaded.</p>
            </div>
          ) : csvError ? (
            <div className="no-results">
              <h3>Could not load recommendations</h3>
              <p>{csvError}</p>
              <p>
                Make sure both CSV files are inside
                <b> public/data/</b>.
              </p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="recommendations">
              {recommendations.map((rule, index) => (
                <div className="recommend-card" key={index}>
                  <span className="rec-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    {rule.type === "apriori" ? (
                      <>
                        <small>BASED ON • APRIORI RULE</small>

                        <h3>{rule.antecedents}</h3>

                        <div className="recommend-arrow">↓</div>

                        <small>RECOMMEND</small>
                        <h3 className="green-text">
                          {rule.consequents}
                        </h3>
                      </>
                    ) : (
                      <>
                        <small>
                          BASED ON • FREQUENTLY PURCHASED TOGETHER
                        </small>

                        <h3>{rule.product}</h3>

                        <div className="recommend-arrow">↓</div>

                        <small>RECOMMEND</small>
                        <h3 className="green-text">
                          {rule.recommended}
                        </h3>
                      </>
                    )}
                  </div>

                  <div className="rec-metrics">
                    {rule.type === "apriori" ? (
                      <>
                        <span>
                          Confidence
                          <b>
                            {(rule.confidence * 100).toFixed(1)}%
                          </b>
                        </span>

                        <span>
                          Lift
                          <b>{rule.lift.toFixed(2)}</b>
                        </span>
                      </>
                    ) : (
                      <span>
                        Transactions
                        <b>{rule.transactions}</b>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No recommendations found</h3>
              <p>
                Try another product from the Online Retail dataset.
              </p>
              <span className="example-text">
                Try: LUNCH BAG, WHITE HANGING HEART, ALARM CLOCK
              </span>
            </div>
          )}
        </Page>
      )}

      {/* INSIGHTS */}
      {active === "Insights" && (
        <Page title="Project Insights" subtitle="Business insights derived from the analysis.">

          <div className="insight-list">

            <div className="insight">
              <span>01</span>
              <div>
                <h3>Frequently purchased products can be identified.</h3>
                <p>
                  Product support values help identify items that occur
                  frequently across the analyzed transactions.
                </p>
              </div>
            </div>

            <div className="insight">
              <span>02</span>
              <div>
                <h3>Strong associations can support cross-selling.</h3>
                <p>
                  Products appearing together can be used to create
                  recommendation opportunities.
                </p>
              </div>
            </div>

            <div className="insight">
              <span>03</span>
              <div>
                <h3>Confidence helps measure rule reliability.</h3>
                <p>
                  Higher confidence means the consequent frequently appears
                  when the antecedent is present.
                </p>
              </div>
            </div>

            <div className="insight">
              <span>04</span>
              <div>
                <h3>Lift identifies positive associations.</h3>
                <p>
                  A lift greater than 1 indicates that the products occur
                  together more often than expected by chance.
                </p>
              </div>
            </div>

          </div>

          <div className="final-insight">
            <span>PROJECT SUMMARY</span>
            <h2>
              Turning transaction data into
              <br />
              actionable product relationships.
            </h2>
            <p>
              Market Basket Analysis provides a simple way to discover
              purchasing patterns and support data-driven product
              recommendations.
            </p>
          </div>

        </Page>
      )}

      {/* FOOTER */}
      <footer>
        <div>
          <strong>Market Basket Analysis</strong>
          <span>Data Mining Project</span>
        </div>

        <span>Built with Python • Apriori • React</span>
      </footer>

    </div>
  );
}


/* PAGE COMPONENT */

function Page({ title, subtitle, children }) {
  return (
    <main className="inner-page">
      <div className="page-heading">
        <span className="section-label">MARKET BASKET ANALYSIS</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      {children}
    </main>
  );
}


/* SMALL COMPONENTS */

function Metric({ title, value }) {
  return (
    <div className="metric-card">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}


function InfoCard({ title, text }) {
  return (
    <div className="info-card">
      <div className="mini-dot"></div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}


function Visual({ title, file }) {
  return (
    <div className="visual-card">
      <div className="visual-title">
        <span>{title}</span>
        <span>↗</span>
      </div>

      <img src={file} alt={title} />
    </div>
  );
}


export default App;