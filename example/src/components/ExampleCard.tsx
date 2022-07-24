import React from 'react';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ScrollDirection, ScrollDirectionState } from 'react-easy-infinite-scroll-hook';
import { LinearProgress, Link, Switch } from '@mui/material';

interface ExampleCardProps {
  hasMore?: ScrollDirectionState;
  onChangeHasMore?: (state: ScrollDirectionState) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  loading?: boolean;
  source?: string;
}

const ExampleCard = ({
  onChangeHasMore,
  hasMore = {},
  children,
  title,
  description,
  loading,
  source,
}: ExampleCardProps) => {
  const handleChangeHasMore = ({ target: { name, checked } }: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeHasMore && hasMore) onChangeHasMore({ ...hasMore, [name]: checked });
  };

  return (
    <>
      {title && (
        <Typography variant="h6" fontWeight="bold">
          {title}{' '}
          {source && (
            <Link variant="body2" target="_blank" href={source} rel="noreferrer noopener">
              Source
            </Link>
          )}
        </Typography>
      )}
      {description && <Typography variant="body2">{description}</Typography>}
      {Object.keys(hasMore).length && (
        <>
          <Typography>Active scroll directions:</Typography>
          <FormGroup row>
            {Object.values(ScrollDirection).reduce((acc, direction) => {
              return Object.keys(hasMore).includes(direction)
                ? [
                    ...acc,
                    <FormControlLabel
                      key={direction}
                      control={
                        <Switch onChange={handleChangeHasMore} name={direction} checked={!!hasMore[direction]} />
                      }
                      label={direction}
                    />,
                  ]
                : acc;
            }, [] as React.ReactNode[])}
          </FormGroup>
        </>
      )}
      <div className="LinearProgress-container">{loading && <LinearProgress />}</div>
      {children}
    </>
  );
};

export default ExampleCard;
