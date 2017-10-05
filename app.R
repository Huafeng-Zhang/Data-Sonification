# Sonification with web audio API

library(shiny)
library(dplyr)
library(ggplot2)
library(jsonlite)
library(animation)

# Define UI for application that draws a histogram
ui <- fluidPage(
  
  tags$head(
    includeScript("https://cdnjs.cloudflare.com/ajax/libs/fetch/1.0.0/fetch.min.js"),        includeScript("https://cdnjs.cloudflare.com/ajax/libs/tone/0.10.0/Tone.min.js"),
    includeScript("www/sonification.js")
  ),
  
  titlePanel("Sonification"),
  
  sidebarLayout(
    sidebarPanel(
      actionButton("sonify", "Sonify"),
      tags$hr(),
      fileInput("file", "Choose CSV File",
                accept = c(
                  "text/csv",
                  "text/comma-separated-values,text/plain",
                  ".csv")
      )
    ),
    
    mainPanel(
      plotOutput("plot1"),
      plotOutput("plot2"),
      plotOutput("plot3"),
      # create <script> tag with web audio functions
      
      tags$script(HTML('
                       
                       // Sonify when button is clicked
                       var sonification_loop_id;
                       $(document).on("shiny:inputchanged", function(event) {
                       if (event.name === "sonify") {
                       console.log("sonification_loop_id", sonification_loop_id);
                       console.log("audio_index", audio_index);
                       if(sonification_loop_id > 0) {
                       console.log("stop");
                       clearInterval(sonification_loop_id);
                       setSonificationButtonLabel("Sonify");
                       sonification_loop_id = 0;
                       }
                       else if (typeof input !== "undefined") { // start or restart
                       console.log("start");
                       
                       if (audio_index == 0) {
                       var month_tre = object2array(input, "month_tre");
                       var year_tre = object2array(input, "year_tre");
                       var resid = object2array(input, "resid");
                       
                       v1 = new Voice("Grand Piano");
                       v2 = new Voice("Alto Flute");
                       v3 = new Voice("Harp");
                       
                       v1.data = month_tre;
                       v2.data = year_tre;
                       v3.data = resid;
                       }
                       
                       setSonificationButtonLabel("Stop");
                       sonification_loop_id = sonify(v1, v2, v3, audio_index);
                       }
                       }
                       });
                       '
      )),
      
      uiOutput("input_data")
      )
      )
    )

# Only plot input data; sonification is by Javascript, not by R/Shiny
server <- function(input, output, session) {
  
  index <- 1
  
  autoInvalidate <- reactiveTimer(100, session)
  
  output$plot1 <- renderPlot({
    inFile <- input$file
    
    if (is.null(inFile)) {
      # ggplot(temps, aes(x=seq(1, n), y=temp)) + geom_point()
    }
    else {
      df <- read.table(inFile$datapath, header = TRUE, sep = ",")
      
      # store data as javascript variable for audio script
      # HTML(paste("<script> var input =", toJSON(df), "</script>"))
      
      df <- mutate(df, temp = year_tre)
      n <- dim(df)[[1]]
      plot(seq(1:n), df$year_tre)
      # ggplot(df, aes(x=seq(1, n), y=temp)) + geom_point()
    }
  })
  
  output$plot2 <- renderPlot({
    
    inFile <- input$file
    
    if (is.null(inFile)) {
      # ggplot(temps, aes(x=seq(1, n), y=temp)) + geom_point()
    }
    else {
      df <- read.table(inFile$datapath, header = TRUE, sep = ",")
      
      df <- mutate(df, temp = (year_tre + month_tre + resid))
      n <- dim(df)[[1]]
      plot(seq(1:n), df$month_tre)
    }
  })
  
  output$input_data <- renderUI({
    inFile <- input$file
    
    if (is.null(inFile)) {
      # HTML(paste(" var input =", toJSON(temps)))
    }
    else {
      inputdata <- read.table(inFile$datapath, header = TRUE, sep = ",")
      HTML(paste("<script> var input =", toJSON(inputdata), "</script>"))
    }
  })
  
  output$plot3 <- renderPlot({
    autoInvalidate()
    
    inFile <- input$file
    if (!is.null(inFile)) {
      df <- read.table(inFile$datapath, header = TRUE, sep = ",")
      
      df <- mutate(df, temp = (year_tre + month_tre + resid))
      n <- dim(df)[[1]]
      
      plot(seq(1:n), df$resid)
      points(c(index), c(df$resid[[index]]), pch = 19, col = "red")
      index <<- index + 1
    }
  })
}

shinyApp(ui = ui, server = server)



